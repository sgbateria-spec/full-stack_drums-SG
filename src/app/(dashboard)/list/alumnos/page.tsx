import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, studentsData} from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type Alumno = {
    id:number;
    alumnoId:string;
    nombre:string;
    email?:string;
    foto:string;
    telefono?:string;
    grado:number;
    clase:string;
    direccion:string;
    
};

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

const AlumnoListPage = () => {
    const renderRow = (item:Alumno) => (
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
            <td className="flex items-center gap-4 p-4">
                <Image 
                    src={item.foto} 
                    alt="" 
                    width={40} 
                    height={40} 
                    className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
                    />
                    
            
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.nombre}</h3>
                <p className="text-xs text-gray-500">{item.clase}</p>
            </div>
            </td>
            <td className="hidden md:table-cell">{item.alumnoId}</td>
            <td className="hidden md:table-cell">{item.grado}</td>
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
            <Table columns={columns} renderRow={renderRow} data={studentsData}/>
            {/* PAGINATION */}
            <Pagination/>
        </div>
    );
};

export default AlumnoListPage