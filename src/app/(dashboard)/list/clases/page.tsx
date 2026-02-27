import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { classesData, role} from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Clase, Maestro, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ClaseList = Clase & {supervisor:Maestro[]};
    
    


const columns = [
    {
        header:"Clase Nombre", 
        accessor:"nombre",
    },
    {
        header:"Capacidad", 
        accessor:"capacidad", 
        className:"hidden md:table-cell",
    },
    {
        header:"Grado", 
        accessor:"grado", 
        className:"hidden md:table-cell",
    },
    // {
    //     header:"Supervisor", 
    //     accessor:"supervisor", 
    //     className:"hidden md:table-cell",
    // },
   
    {
        header:"Acciones", 
        accessor:"acciones", 
    },                
];

const renderRow = (item:ClaseList) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">{item.nombre}</td>
        <td className="hidden md:table-cell">{item.capacidad}</td>
        <td className="hidden md:table-cell">{item.nombre[0]}</td>
      {/* <td className="hidden md:table-cell">{item.supervisor.name + " " + item.supervisor.usuario}</td> */}
        <td>
            <div className="flex items-center gap-2">
                <Link href={`/list/alumnos/{item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky ">
                        <Image src="/edit.png" alt="" width={16} height={16}/>
                    </button>
                </Link>
                    {role === "admin" && ( 
                        <>
                        <FormModal table="clase" type="update" data={item} />
                        <FormModal table="clase" type="delete" id={item.id} />
                        </>

                    )}
                
            </div>
        </td>
    </tr>

);
const ClaseListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const { page, ...queryParams } = await searchParams;

    const p = page ? parseInt(page) : 1;

    //URL PARAMS CONDITION
    const query: Prisma.ClaseWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                        case "search":
                            query.nombre = {contains:value, mode:"insensitive"}    
                             break;
                        
                }
            }

        }
    }
       

    const [data, count] = await prisma.$transaction([
        prisma.clase.findMany({
            where: query,
            include: {
                supervisor: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.clase.count({where:query}),
    ]);
    

    return(
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Todas las Clases</h1>
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
                            <FormModal table="clase" type="create"/>
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

export default ClaseListPage