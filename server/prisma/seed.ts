import { EventStatus, UserRole } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";

async function main() {
  await prisma.user.upsert({
    where: { email: "organizer@evently.local" },
    update: {},
    create: {
      name: "Soundwave Events",
      email: "organizer@evently.local",
      avatarUrl: "/images/avatar1.jpg",
      role: UserRole.ADMIN,
    },
  });

  await prisma.event.upsert({
    where: { id: "event_summer_soundwave_2026" },
    update: {},
    create: {
      id: "event_summer_soundwave_2026",
      title: "Summer Soundwave 2026",
      description:
        "Experience an unforgettable night of live music featuring top artists from around the world.",
      category: "Music",
      tags: ["Music", "Festival", "Live"],
      imageUrl: "/images/event2.jpg",
      location: "Los Angeles, CA",
      address: "Hollywood Bowl, Los Angeles, CA",
      latitude: "34.112200",
      longitude: "-118.339100",
      eventDate: new Date("2026-06-12"),
      startTime: "18:00",
      endTime: "23:00",
      ticketPrice: "50.00",
      totalTickets: 1000,
      ticketsRemaining: 428,
      status: EventStatus.PUBLISHED,
      isFeatured: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
