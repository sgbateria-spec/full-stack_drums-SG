import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import {eventsData, role} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Evento = {
    id:number;
    titulo:string;
    clases:string; 
    fecha:string;
    startTime:string;
    endTime:string;
    
};

const columns = [
    {
        header:"Titulo", 
        accessor:"titulo",
    },
    {
        header:"Clases", 
        accessor:"clases", 
        
    },
    {
        header:"Fecha", 
        accessor:"fecha", 
        className:"hidden md:table-cell",
    },
    {
        header:"StartTime", 
        accessor:"startTime", 
        className:"hidden md:table-cell",
    },
    {
        header:"EndTime", 
        accessor:"endTime", 
        className:"hidden md:table-cell",
    },
    {
        header:"Acciones", 
        accessor:"acciones", 
    },                
];

const EventoListPage = () => {
    const renderRow = (item:Evento) => (
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
            <td className="flex items-center gap-4 p-4">{item.titulo}</td>            
            <td>{item.clases}</td>
            <td className="hidden md:table-cell">{item.fecha}</td>
            <td className="hidden md:table-cell">{item.startTime}</td>
            <td className="hidden md:table-cell">{item.endTime}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/list/alumnos/{item.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky ">
                            <Image src="/edit.png" alt="" width={16} height={16}/>
                        </button>
                    </Link>
                        {role === "admin" && ( 
                            <>
                            <FormModal table="evento" type="update" data={item} />
                            <FormModal table="evento" type="delete" id={item.id} />
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
                <h1 className="hidden md:block text-lg font-semibold">Todos los Eventos</h1>
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
                            <FormModal table="evento" type="create"/>
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={eventsData}/>
            {/* PAGINATION */}
            <Pagination/>
        </div>
    );
};

export default EventoListPage