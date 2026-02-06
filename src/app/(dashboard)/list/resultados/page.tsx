import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import {resultsData, role} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Resultado = {
    id:number;
    materia:string;
    clase:string; 
    maestro:string;
    estudiante:string;
    tipo: "exámen" | "asignación";
    fecha:string;
    puntaje:number;
};

const columns = [
    {
        header:"Materia Nombre", 
        accessor:"nombre",
    },
    {
        header:"Estudiante", 
        accessor:"estudiante", 
       
    },
    {
        header:"Puntaje", 
        accessor:"puntaje", 
        className:"hidden md:table-cell",
    },
    {
        header:"Maestro", 
        accessor:"maestro", 
        className:"hidden md:table-cell",
    },
    {
        header:"Clase", 
        accessor:"clase", 
        className:"hidden md:table-cell",
    },
    {
        header:"Fecha", 
        accessor:"fecha", 
        className:"hidden md:table-cell",
    },
    {
        header:"Acciones", 
        accessor:"acciones", 
    },                
];

const ResultadoListPage = () => {
    const renderRow = (item:Resultado) => (
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
            <td className="flex items-center gap-4 p-4">{item.materia}</td>            
            <td>{item.estudiante}</td>
            <td className="hidden md:table-cell">{item.puntaje}</td>
            <td className="hidden md:table-cell">{item.maestro}</td>
            <td className="hidden md:table-cell">{item.clase}</td>
            <td className="hidden md:table-cell">{item.fecha}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/list/alumnos/{item.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky ">
                            <Image src="/edit.png" alt="" width={16} height={16}/>
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

    return(
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Todos los Resultados</h1>
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
                            <FormModal table="resultado" type="create"/>
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={resultsData}/>
            {/* PAGINATION */}
            <Pagination/>
        </div>
    );
};

export default ResultadoListPage