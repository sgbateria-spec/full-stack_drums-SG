import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  await prisma.admin.create({
    data: {
      id: "admin1",
      username: "admin1",
    },
  });
  await prisma.admin.create({
    data: {
      id: "admin2",
      username: "admin2",
    },
  });

  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grado.create({
      data: {
        nivel: i,
      },
    });
  }

  // CLASS
  for (let i = 1; i <= 6; i++) {
    await prisma.clase.create({
      data: {
        nombre: `${i}A`, 
        gradoId: i, 
        capacidad: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // SUBJECT
  const materiaData = [
    { nombre: "Mathematics" },
    { nombre: "Science" },
    { nombre: "English" },
    { nombre: "History" },
    { nombre: "Geography" },
    { nombre: "Physics" },
    { nombre: "Chemistry" },
    { nombre: "Biology" },
    { nombre: "Computer Science" },
    { nombre: "Art" },
  ];

  for (const materia of materiaData) {
    await prisma.materia.create({ data: materia });
  }

  // TEACHER
  for (let i = 1; i <= 15; i++) {
    await prisma.maestro.create({
      data: {
        id: `teacher${i}`, // Unique ID for the teacher
        usuario: `teacher${i}`,
        nombre: `TName${i}`,
        apellido: `TSurname${i}`,
        email: `teacher${i}@example.com`,
        telefono: `123-456-789${i}`,
        direccion: `Address${i}`,
        bloodType: "A+",
        sexo: i % 2 === 0 ? UserSex.HOMBRE : UserSex.MUJER,
        materias: { connect: [{ id: (i % 10) + 1 }] }, 
        clases: { connect: [{ id: (i % 6) + 1 }] }, 
        
      },
    });
  }

  // LESSON
  for (let i = 1; i <= 30; i++) {
    await prisma.leccion.create({
      data: {
        nombre: `Lesson${i}`, 
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ], 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)), 
        materiaId: (i % 10) + 1, 
        claseId: (i % 6) + 1, 
        maestroId: `teacher${(i % 15) + 1}`, 
      },
    });
  }

  // STUDENT
  for (let i = 1; i <= 50; i++) {
    await prisma.alumno.create({
      data: {
        id: `student${i}`, 
        usuario: `student${i}`, 
        nombre: `SName${i}`,
        apellido: `SSurname ${i}`,
        email: `student${i}@example.com`,
        telefono: `987-654-321${i}`,
        direccion: `Address${i}`,
        bloodType: "O-",
        sexo: i % 2 === 0 ? UserSex.HOMBRE : UserSex.MUJER,
        gradoId: (i % 6) + 1, 
        claseId: (i % 6) + 1, 
        
      },
    });
  }

  // EXAM
  for (let i = 1; i <= 10; i++) {
    await prisma.examen.create({
      data: {
        titulo: `Exam ${i}`, 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
        leccionId: (i % 30) + 1, 
      },
    });
  }

  // ASSIGNMENT
  for (let i = 1; i <= 10; i++) {
    await prisma.asignacion.create({
      data: {
        titulo: `Assignment ${i}`, 
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)), 
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
        leccionId: (i % 30) + 1, 
      },
    });
  }

  // RESULT
  for (let i = 1; i <= 10; i++) {
    await prisma.resultado.create({
      data: {
        score: 90, 
        alumnoId: `student${i}`, 
        ...(i <= 5 ? { examenId: i } : { asignacionId: i - 5 }), 
      },
    });
  }

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    await prisma.asistencia.create({
      data: {
        date: new Date(), 
        presente: true, 
        alumnoId: `student${i}`, 
        leccionId: (i % 30) + 1, 
      },
    });
  }

  // EVENT
  for (let i = 1; i <= 5; i++) {
    await prisma.evento.create({
      data: {
        titulo: `Event ${i}`, 
        descripcion: `Description for Event ${i}`, 
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
        claseId: (i % 5) + 1, 
      },
    });
  }

  // ANNOUNCEMENT
  for (let i = 1; i <= 5; i++) {
    await prisma.anuncio.create({
      data: {
        titulo: `Announcement ${i}`, 
        descripcion: `Description for Announcement ${i}`, 
        date: new Date(), 
        claseId: (i % 5) + 1, 
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
