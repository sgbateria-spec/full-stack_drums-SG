import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { resultsData, role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ResultadoList = {
    id: number;
    titulo: string;
    alumnoNombre: string;
    alumnoApellido: string;
    maestroNombre: string;
    maestroApellido: string;
    puntaje: number,
    claseNombre: string,
    startTime: Date,


}

const columns = [
    {
        header: "Titulo",
        accessor: "titulo",
    },
    {
        header: "Estudiante",
        accessor: "estudiante",

    },
    {
        header: "Puntaje",
        accessor: "puntaje",
        className: "hidden md:table-cell",
    },
    {
        header: "Maestro",
        accessor: "maestro",
        className: "hidden md:table-cell",
    },
    {
        header: "Clase",
        accessor: "clase",
        className: "hidden md:table-cell",
    },
    {
        header: "Fecha",
        accessor: "fecha",
        className: "hidden md:table-cell",
    },
    {
        header: "Acciones",
        accessor: "acciones",
    },
];

const renderRow = (item: ResultadoList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">{item.titulo}</td>
        <td>{item.alumnoNombre + " " + item.alumnoApellido}</td>
        <td className="hidden md:table-cell">{item.puntaje}</td>
        <td className="hidden md:table-cell">{item.maestroNombre + " " + item.maestroApellido}</td>
        <td className="hidden md:table-cell">{item.claseNombre}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
        <td>
            <div className="flex items-center gap-2">
                <Link href={`/list/alumnos/{item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky ">
                        <Image src="/edit.png" alt="" width={16} height={16} />
                    </button>
                </Link>
                {role === "admin" && (
                    <>
                        <FormModal table="resultado" type="update" data={item} />
                        <FormModal table="resultado" type="delete" id={item.id} />
                    </>

                )}

            </div>
        </td>
    </tr>

);

const ResultadoListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const { page, ...queryParams } = await searchParams;

    const p = page ? parseInt(page) : 1;

    //URL PARAMS CONDITION
    const query: Prisma.ResultadoWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "alumnoId":
                        query.alumnoId = value;
                        break;
                    case "search":
                        query.OR = [
                            { examen: { titulo: { contains: value, mode: "insensitive" } } },
                            { alumno: { nombre: { contains: value, mode: "insensitive" } } },
                        ];
                        break;
                        default:
                        break;
                }
            }

        }
    }


    const [dataRes, count] = await prisma.$transaction([
        prisma.resultado.findMany({
            where: query,
            include: {
                alumno: { select: { nombre: true, apellido: true } },
                examen: {
                    include: {
                        leccion: {
                            select: {
                                clase: { select: { nombre: true } },
                                maestro: { select: { nombre: true, apellido: true } },
                            },
                        },
                    },
                },
                asignacion: {
                    include: {
                        leccion: {
                            select: {
                                clase: { select: { nombre: true } },
                                maestro: { select: { nombre: true, apellido: true } },
                            },
                        },
                    },
                },
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.resultado.count({ where: query }),
    ]);

    const data = dataRes.map(item => {
        const assessment = item.examen || item.asignacion

        if (!assessment) return null;

        const isExamen = "startTime" in assessment;

        return {
            id: item.id,
            titulo: assessment.titulo,
            alumnoNombre: item.alumno.nombre,
            alumnoApellido: item.alumno.apellido,
            maestroNombre: assessment.leccion.maestro.nombre,
            maestroApellido: assessment.leccion.maestro.apellido,
            puntaje: item.score,
            claseNombre: assessment.leccion.clase.nombre,
            startTime: isExamen ? assessment.startTime : assessment.startDate,

        };
    });

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Todos los Resultados</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" && (
                            <FormModal table="resultado" type="create" />
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={data} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    );
};

export default ResultadoListPage