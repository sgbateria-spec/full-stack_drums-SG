import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { classesData, lessonsData, role} from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Clase, Leccion, Maestro, Materia, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type LeccionList = Leccion & {materia:Materia} & {clase:Clase} & {maestro:Maestro;
}; 


const columns = [
    {
        header:"Materia Nombre", 
        accessor:"nombre",
    },
    {
        header:"Clase", 
        accessor:"clase", 
       
    },
    {
        header:"Maestro", 
        accessor:"maestro", 
        className:"hidden md:table-cell",
    },
    {
        header:"Acciones", 
        accessor:"acciones", 
    },                
];

const renderRow = (item:LeccionList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">{item.materia.nombre}</td>
        <td>{item.clase.nombre}</td>
        <td className="hidden md:table-cell">{item.maestro.nombre +  " " + item.maestro.apellido}</td>
        <td>
            <div className="flex items-center gap-2">
                <Link href={`/list/alumnos/{item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky ">
                        <Image src="/edit.png" alt="" width={16} height={16}/>
                    </button>
                </Link>
                    {role === "admin" && ( 
                        <>
                        <FormModal table="leccion" type="update" data={item} />
                        <FormModal table="leccion" type="delete" id={item.id} />
                    </>

                    )}
                
            </div>
        </td>
    </tr>

);


const LeccionListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const { page, ...queryParams } = await searchParams;

    const p = page ? parseInt(page) : 1;

    //URL PARAMS CONDITION
    const query: Prisma.LeccionWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "claseId":
                            query.claseId = parseInt(value);   
                            break;
                            case "maestroId":
                            query.maestroId = value;   
                            break;
                            
                         case "search":
                            query.OR = [
                                {materia:{nombre: { contains:value, mode:"insensitive"}}},
                                {maestro:{nombre: { contains:value, mode:"insensitive"}}},
                            ];
                            break;
                            default:
                            break;                        
                }
            }

        }
    }
       

    const [data, count] = await prisma.$transaction([
        prisma.leccion.findMany({
            where: query,
            include: {
                materia: {select: {nombre: true}},
                clase: {select: {nombre: true}},
                maestro: {select: {nombre: true, apellido: true}},
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.leccion.count({where:query}),
    ]);


   
    return(
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Todas las Lecciones</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch/>
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        {role === "admin" && (
                            <FormModal table="leccion" type="create"/>
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={data}/>
            {/* PAGINATION */}
            <Pagination page={p} count={count}/>
        </div>
    );
};

export default LeccionListPage