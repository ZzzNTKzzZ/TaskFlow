import { prisma } from "./lib/prisma.js";

async function main() {
  console.log("🚀 Starting database seeding workflow...");

  // 1. Get an existing user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("❌ No user found in the database. Please register/login in the app first.");
    return;
  }
  console.log(`👤 Found user to associate data: ${user.name} (${user.email})`);

  // Random names and templates
  const workspaceNames = ["Marketing Campaign", "Product Launch Sprint", "Engineering Operations"];
  const boardNames = ["Q3 Planning", "Design & Assets", "Bug Tracker"];
  const listNames = ["Backlog", "In Progress", "Code Review", "Done"];
  const cardNames = [
    "Design App Wireframes",
    "Setup API Authentication",
    "Integrate Payment Gateway",
    "Create User Onboarding Guide",
    "Optimize Database Indexes",
    "Write End-to-End Tests",
  ];
  const checklistNames = ["Requirements", "Quality Checklist", "Deployment Steps"];
  const checklistItems = [
    "Verify dark mode design",
    "Run unit tests",
    "Get approval from product manager",
    "Write documentation",
    "Check memory consumption",
  ];

  // Helper to get random item
  const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;
  const getRandomSubset = <T>(arr: T[], size: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
  };

  // 2. Create 2 workspaces
  for (let w = 1; w <= 2; w++) {
    const wsName = `${getRandomItem(workspaceNames)} #${Math.floor(Math.random() * 1000)}`;
    const wsSlug = `ws-${Date.now()}-${w}`;
    
    console.log(`📂 Creating Workspace: "${wsName}"...`);
    const workspace = await prisma.workspace.create({
      data: {
        name: wsName,
        slug: wsSlug,
      },
    });

    // Create Workspace Member
    await prisma.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: workspace.id,
        role: "OWNER",
      },
    });

    // Create 2 boards in this workspace
    for (let b = 1; b <= 2; b++) {
      const boardName = `${getRandomItem(boardNames)} [Part ${b}]`;
      const bg = getRandomItem(["gradient-1", "gradient-2", "gradient-3", "gradient-4", "gradient-5", "#3b82f6", "#10b981", "#ef4444"]);
      
      console.log(`  📋 Creating Board: "${boardName}" in workspace "${wsName}"...`);
      const board = await prisma.board.create({
        data: {
          name: boardName,
          background: bg,
          visibility: "workspace",
          workspaceId: workspace.id,
          position: b * 1000,
        },
      });

      // Add user as Board Member
      await prisma.boardMember.create({
        data: {
          userId: user.id,
          boardId: board.id,
        },
      });

      // Log board creation activity
      await prisma.activityLog.create({
        data: {
          boardId: board.id,
          userId: user.id,
          action: "BOARD_CREATED",
          description: `created board "${boardName}"`,
        },
      });

      // Create 2 lists in this board
      const selectedLists = getRandomSubset(listNames, 2);
      for (let l = 0; l < selectedLists.length; l++) {
        const listName = selectedLists[l];
        console.log(`    📁 Creating List: "${listName}"...`);
        const list = await prisma.list.create({
          data: {
            name: listName!,
            position: (l + 1) * 1000,
            boardId: board.id,
          },
        });

        // Log list creation activity
        await prisma.activityLog.create({
          data: {
            boardId: board.id,
            userId: user.id,
            listId: list.id,
            action: "LIST_CREATED",
            description: `added list "${listName}" to this board`,
          },
        });

        // Create 2 cards in this list
        const selectedCards = getRandomSubset(cardNames, 2);
        for (let c = 0; c < selectedCards.length; c++) {
          const cardName = selectedCards[c];
          
          let dueDate: Date | null = null;
          const rand = Math.random();
          if (rand > 0.25) { // 75% chance to have a due date
            const now = new Date();
            if (rand <= 0.45) {
              // Yesterday (Overdue)
              now.setDate(now.getDate() - 1);
            } else if (rand <= 0.65) {
              // Today
              now.setHours(now.getHours() + Math.floor(Math.random() * 8) - 4);
            } else if (rand <= 0.85) {
              // Tomorrow
              now.setDate(now.getDate() + 1);
            } else {
              // Next week
              now.setDate(now.getDate() + 7);
            }
            dueDate = now;
          }

          console.log(`      🗂️ Creating Card: "${cardName}" (dueDate: ${dueDate ? dueDate.toISOString() : 'none'})...`);
          const card = await prisma.card.create({
            data: {
              name: cardName!,
              description: `This is a randomly generated test card for "${cardName}".`,
              position: (c + 1) * 1000,
              priority: getRandomItem(["low", "medium", "high", "urgent"]),
              listId: list.id,
              dueDate: dueDate,
            },
          });

          // Assign user to card
          await prisma.cardAssignee.create({
            data: {
              userId: user.id,
              cardId: card.id,
            },
          });

          // Log card creation activity
          await prisma.activityLog.create({
            data: {
              boardId: board.id,
              userId: user.id,
              cardId: card.id,
              action: "CARD_CREATED",
              description: `added card "${cardName}" to list "${listName}"`,
            },
          });

          // Create 2 checklists in this card
          const selectedChecklists = getRandomSubset(checklistNames, 2);
          for (let ch = 0; ch < selectedChecklists.length; ch++) {
            const chName = selectedChecklists[ch];
            console.log(`        📝 Creating Checklist: "${chName}"...`);
            const checklist = await prisma.checklist.create({
              data: {
                name: chName!,
                cardId: card.id,
              },
            });

            // Log checklist creation activity
            await prisma.activityLog.create({
              data: {
                boardId: board.id,
                userId: user.id,
                cardId: card.id,
                action: "CHECKLIST_CREATED",
                description: `added checklist "${chName}" to card "${cardName}"`,
              },
            });

            // Create 2 items in this checklist
            const selectedItems = getRandomSubset(checklistItems, 2);
            for (let itemIdx = 0; itemIdx < selectedItems.length; itemIdx++) {
              const itemName = selectedItems[itemIdx];
              const isCompleted = Math.random() > 0.5; // Randomly completed
              
              console.log(`          ✅ Creating Checklist Item: "${itemName}" (completed: ${isCompleted})...`);
              await prisma.checklistItem.create({
                data: {
                  name: itemName!,
                  isCompleted: isCompleted,
                  checklistId: checklist.id,
                },
              });

              if (isCompleted) {
                // Log checklist item completion activity
                await prisma.activityLog.create({
                  data: {
                    boardId: board.id,
                    userId: user.id,
                    cardId: card.id,
                    action: "CHECKLIST_ITEM_COMPLETED",
                    description: `marked the checklist item "${itemName}" as completed`,
                  },
                });
              }
            }
          }
        }
      }
    }
  }

  console.log("🎉 Database seeding successfully completed with random workflows!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
