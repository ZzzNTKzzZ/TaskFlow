

export default function dayLeft(futureDate: Date | null | undefined): number | null {
    if(!futureDate) return null;
    const now = new Date();
    const difference =futureDate.getTime() - now.getTime();
    const daysDiff = Math.trunc(difference / (1000 * 60 * 60 * 24));
    return daysDiff
}