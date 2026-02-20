import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, studentsData} from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Alumno, Clase, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type AlumnoList = Alumno & {clase:Clase}

const columns = [
    {
        header:"Info", 
        accessor:"info",
    },
    {
        header:"Alumno ID", 
        accessor:"alumnoId", 
        className:"hidden md:table-cell",
    },
    {
        header:"Grado", 
        accessor:"grado", 
        className:"hidden md:table-cell",
    },
    {
        header:"Telefono", 
        accessor:"telefono", 
        className:"hidden lg:table-cell",
    },
    {
        header:"Direccion", 
        accessor:"direccion", 
        className:"hidden lg:table-cell",
    },
    {
        header:"Acciones", 
        accessor:"acciones", 
    },                
];


    const renderRow = (item:AlumnoList) => (
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
            <td className="flex items-center gap-4 p-4">
                <Image 
                    src={item.img || "/noAvatar.png"} 
                    alt="" 
                    width={40} 
                    height={40} 
                    className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
                    />
                    
            
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.nombre}</h3>
                <p className="text-xs text-gray-500">{item.clase.nombre}</p>
            </div>
            </td>
            <td className="hidden md:table-cell">{item.usuario}</td>
            <td className="hidden md:table-cell">{item.clase.nombre[0]}</td>
            <td className="hidden md:table-cell">{item.telefono}</td>
            <td className="hidden md:table-cell">{item.direccion}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/list/alumnos/{item.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky ">
                            <Image src="/view.png" alt="" width={16} height={16}/>
                        </button>
                    </Link>
                        {role === "admin" && ( 
                            <FormModal table="alumno" type="delete" id={item.id}/>
                        )}
                    
                </div>
            </td>
        </tr>

    );

    const AlumnoListPage = async ({
        searchParams,
    }: {
        searchParams: { [key: string]: string | undefined };
    }) => {
    
        const { page, ...queryParams } = await searchParams;
    
        const p = page ? parseInt(page) : 1;
    
        //URL PARAMS CONDITION
        const query: Prisma.AlumnoWhereInput = {};
    
        if (queryParams) {
            for (const [key, value] of Object.entries(queryParams)) {
                if (value !== undefined) {
                    switch (key) {
                        case "maestroId":
                            query.clase = {
                                lecciones:{
                                    some: {
                                        maestroId: value,
                                    },
                                },                               
                            };
                            break;
                            case "search":
                                query.nombre = {contains:value, mode:"insensitive"}    
    
    
                    }
                }
    
            }
        }
    
    
    
        const [data, count] = await prisma.$transaction([
            prisma.alumno.findMany({
                where: query,
                include: {
                    clase: true,
                },
                take: ITEM_PER_PAGE,
                skip: ITEM_PER_PAGE * (p - 1),
            }),
            prisma.alumno.count({where:query}),
        ]);


    return(
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Todos los Alumnos</h1>
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
                                <FormModal table="alumno" type="create"/>
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

export default AlumnoListPage