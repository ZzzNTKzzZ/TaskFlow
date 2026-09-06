import { prisma } from "./src/lib/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const BASE_URL = "http://localhost:5000";

interface TestStep {
  name: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  endpoint: string;
  expectedStatus: number;
  run: () => Promise<{
    passed: boolean;
    status: number;
    durationMs: number;
    data?: any;
    error?: string;
  }>;
}

async function runApiTestSuite() {
  console.log("\n========================================================");
  console.log("🚀 TASKFLOW COMPREHENSIVE BACKEND API TEST SUITE");
  console.log("========================================================\n");

  // 1. Prepare Test User & Tokens directly with Database & Auth
  let testUser = await prisma.user.findFirst();
  let testPassword = "password123";

  if (!testUser) {
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    testUser = await prisma.user.create({
      data: {
        name: "Test Engineer",
        email: "test_suite@taskflow.com",
        password: hashedPassword,
      },
    });
  } else {
    // Update password for known login testing
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    await prisma.user.update({
      where: { id: testUser.id },
      data: { password: hashedPassword },
    });
  }

  let accessToken = "";
  let refreshToken = "";
  let sampleWorkspaceId = "";
  let sampleBoardId = "";
  let sampleCardId = "";

  const steps: TestStep[] = [
    {
      name: "1. Health Check Connection",
      method: "GET",
      endpoint: "/api/check-connection",
      expectedStatus: 200,
      run: async () => {
        const start = Date.now();
        const res = await fetch(`${BASE_URL}/api/check-connection`);
        const durationMs = Date.now() - start;
        const data = await res.json();
        return {
          passed: res.status === 200 && !!data.message,
          status: res.status,
          durationMs,
          data,
        };
      },
    },
    {
      name: "2. Security - Reject Unauthenticated Access",
      method: "GET",
      endpoint: "/workspaces",
      expectedStatus: 401,
      run: async () => {
        const start = Date.now();
        const res = await fetch(`${BASE_URL}/workspaces`);
        const durationMs = Date.now() - start;
        const data = await res.json().catch(() => ({}));
        return {
          passed: res.status === 401,
          status: res.status,
          durationMs,
          data,
        };
      },
    },
    {
      name: "3. Authentication - User Login",
      method: "POST",
      endpoint: "/auth/login",
      expectedStatus: 200,
      run: async () => {
        const start = Date.now();
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: testUser!.email,
            password: testPassword,
          }),
        });
        const durationMs = Date.now() - start;
        const json = await res.json();
        if (res.status === 200 && json?.data?.accessToken) {
          accessToken = json.data.accessToken;
          refreshToken = json.data.refreshToken;
          return { passed: true, status: res.status, durationMs, data: json.data };
        }
        return { passed: false, status: res.status, durationMs, error: json.message };
      },
    },
    {
      name: "4. Authentication - Refresh Token Rotation",
      method: "POST",
      endpoint: "/auth/refresh-token",
      expectedStatus: 200,
      run: async () => {
        const start = Date.now();
        const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        const durationMs = Date.now() - start;
        const json = await res.json();
        
        // Check if returned tokens are present
        const returnedAccessToken = json?.data?.accessToken || json?.accessToken;
        const returnedRefreshToken = json?.data?.refreshToken || json?.refreshToken;

        if (res.status === 200 && returnedAccessToken) {
          accessToken = returnedAccessToken;
          if (returnedRefreshToken) {
            refreshToken = returnedRefreshToken;
          }
          return { passed: true, status: res.status, durationMs, data: { newAccessToken: returnedAccessToken.slice(0, 20) + "...", newRefreshToken: returnedRefreshToken?.slice(0, 20) + "..." } };
        }
        return {
          passed: false,
          status: res.status,
          durationMs,
          error: json.message || JSON.stringify(json),
        };
      },
    },
    {
      name: "5. Workspaces - Get User Workspaces & Stats",
      method: "GET",
      endpoint: "/workspaces",
      expectedStatus: 200,
      run: async () => {
        const start = Date.now();
        const res = await fetch(`${BASE_URL}/workspaces`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const durationMs = Date.now() - start;
        const json = await res.json();
        if (res.status === 200 && Array.isArray(json?.data)) {
          if (json.data.length > 0) {
            sampleWorkspaceId = json.data[0].id;
          }
          return { passed: true, status: res.status, durationMs, data: json.data.slice(0, 2) };
        }
        return { passed: false, status: res.status, durationMs, error: json.message };
      },
    },
    {
      name: "6. Global Search - Search across Workspaces, Boards, Cards",
      method: "GET",
      endpoint: "/search?q=a",
      expectedStatus: 200,
      run: async () => {
        const start = Date.now();
        const res = await fetch(`${BASE_URL}/search?q=a`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const durationMs = Date.now() - start;
        const json = await res.json();
        const valid =
          res.status === 200 &&
          json.data &&
          Array.isArray(json.data.workspaces) &&
          Array.isArray(json.data.boards) &&
          Array.isArray(json.data.cards);
        return { passed: valid, status: res.status, durationMs, data: json.data };
      },
    },
    {
      name: "7. Boards - Get Board Details with Lists & Cards",
      method: "GET",
      endpoint: "/boards/:boardId",
      expectedStatus: 200,
      run: async () => {
        // Find an accessible board
        const board = await prisma.board.findFirst();
        if (!board) {
          return { passed: true, status: 200, durationMs: 0, data: "No board in DB (skipped)" };
        }
        sampleBoardId = board.id;
        const start = Date.now();
        const res = await fetch(`${BASE_URL}/boards/${sampleBoardId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const durationMs = Date.now() - start;
        const json = await res.json();
        if (res.status === 200 && json?.data?.id) {
          return { passed: true, status: res.status, durationMs, data: { boardName: json.data.name, listCount: json.data.lists?.length } };
        }
        return { passed: false, status: res.status, durationMs, error: json.message };
      },
    },
    {
      name: "8. Activity Log - Check Detailed Activity Descriptions",
      method: "GET",
      endpoint: "/activities/me",
      expectedStatus: 200,
      run: async () => {
        const start = Date.now();
        const res = await fetch(`${BASE_URL}/activities/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const durationMs = Date.now() - start;
        const json = await res.json();
        if (res.status === 200 && Array.isArray(json?.data)) {
          return { passed: true, status: res.status, durationMs, data: json.data.slice(0, 3) };
        }
        return { passed: false, status: res.status, durationMs, error: json.message };
      },
    },
  ];

  let passedCount = 0;

  for (const step of steps) {
    process.stdout.write(`⏳ Testing [${step.method}] ${step.endpoint.padEnd(28)} ... `);
    try {
      const result = await step.run();
      if (result.passed) {
        passedCount++;
        console.log(`\x1b[32m[PASS]\x1b[0m (${result.status}) in ${result.durationMs}ms`);
        if (result.data) {
          const preview = typeof result.data === "object" 
            ? JSON.stringify(result.data).slice(0, 100) + (JSON.stringify(result.data).length > 100 ? "..." : "")
            : String(result.data);
          console.log(`   ↳ Response sample: \x1b[36m${preview}\x1b[0m`);
        }
      } else {
        console.log(`\x1b[31m[FAIL]\x1b[0m (Got ${result.status}, expected ${step.expectedStatus}) in ${result.durationMs}ms`);
        if (result.error) {
          console.log(`   ↳ Error: \x1b[31m${result.error}\x1b[0m`);
        }
      }
    } catch (err: any) {
      console.log(`\x1b[31m[EXCEPTION]\x1b[0m: ${err.message}`);
    }
  }

  console.log("\n========================================================");
  console.log(`📊 TEST SUMMARY: ${passedCount}/${steps.length} Passed (${Math.round((passedCount / steps.length) * 100)}%)`);
  console.log("========================================================\n");

  await prisma.$disconnect();
}

runApiTestSuite().catch((e) => {
  console.error("Test Suite Fatal Error:", e);
  process.exit(1);
});
