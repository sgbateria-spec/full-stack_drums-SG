"use client"

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
// import MaestroForm from "./forms/MaestroForm";
// import AlumnoForm from "./forms/AlumnoForm";

const MaestroForm = dynamic(()=>import("./forms/MaestroForm"),{
    loading: ()=><h1>Cargando....</h1>
});
const AlumnoForm = dynamic(()=>import("./forms/AlumnoForm"),{
    loading: ()=><h1>Cargando....</h1>
});
const MateriaForm = dynamic(()=>import("./forms/MateriaForm"),{
    loading: ()=><h1>Cargando....</h1>
});
const ClaseForm = dynamic(()=>import("./forms/ClaseForm"),{
    loading: ()=><h1>Cargando....</h1>
});
const LeccionForm = dynamic(()=>import("./forms/LeccionForm"),{
    loading: ()=><h1>Cargando....</h1>
});
const ExamenForm = dynamic(()=>import("./forms/ExamenForm"),{
    loading: ()=><h1>Cargando....</h1>
});
const AsignacionForm = dynamic(()=>import("./forms/AsignacionForm"),{
    loading: ()=><h1>Cargando....</h1>
});
const ResultadoForm = dynamic(()=>import("./forms/ResultadoForm"),{
    loading: ()=><h1>Cargando....</h1>
});
const AsistenciaForm = dynamic(()=>import("./forms/AsistenciaForm"),{
    loading: ()=><h1>Cargando....</h1>
});
const EventoForm = dynamic(()=>import("./forms/EventoForm"),{
    loading: ()=><h1>Cargando....</h1>
});
const AnuncioForm = dynamic(()=>import("./forms/AnuncioForm"),{
    loading: ()=><h1>Cargando....</h1>
});



const forms:
    {[key:string]:(type:"create" | "update", data?:any)=> JSX.Element;
 }={
    maestro: (type, data) => <MaestroForm type={type} data={data}/>,
    alumno: (type, data) => <AlumnoForm type={type} data={data}/>,
    materia: (type, data) => <MateriaForm type={type} data={data} />,
    clase: (type, data) => <ClaseForm type={type} data={data} />,
    leccion: (type, data) => <LeccionForm type={type} data={data} />,
    examen: (type, data) => <ExamenForm type={type} data={data} />,
    asignacion: (type, data) => <AsignacionForm type={type} data={data} />,
    resultado: (type, data) => <ResultadoForm type={type} data={data} />,
    asistencia: (type, data) => <AsistenciaForm type={type} data={data} />,
    evento: (type, data) => <EventoForm type={type} data={data} />,
    anuncio: (type, data) => <AnuncioForm type={type} data={data} />,

 };

const FormModal = ({table,type,data,id}:{
    table: "maestro" | "alumno" 
    | "materia"
    | "cancion"
    | "clase"
    | "leccion"
    | "examen"
    | "asignacion"
    | "resultado"
    | "asistencia"
    | "evento"
    | "anuncio";
    type: "create"
    | "update"
    | "delete";
    data?: any;
    id?: number;
}) => {

    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
    const bgColor = type === "create" ? "bg-lamaYellow" : type === "update" ? "bg-lamaSky" : "bg-lamaPurple";


    const [open, setOpen] = useState(false);

    const Form = ()=>{
        return type === "delete" && id ? ( 
        <form action="" className="p-4 flex flex-col gap-4">
            <span className="text-center font-medium">Toda la información se perderá. Estás seguro de que quieres barrar {table}?</span>
            <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">Delete</button>
        </form> ): type === "create" || type === "update" ?( 
            forms[table](type,data)
        ): (
            "Formulario Not Found!"
        ); 
    };



    return (
        <>
            <button className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
            onClick={()=>setOpen(true)}
            >
                <Image src={`/${type}.png`} alt="" width={16} height={16}/>
            </button>
            {open && <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xg:w-[50%] 2xl:w-[40%]">
                    <Form/>
                    <div className="absolute top-4 right-4 cursor-pointer" onClick={()=>setOpen(false)}>
                        <Image src="/close.png" alt="" width={14} height={14}/>
                    </div>
                </div>
                
            </div> }    
        </>
    )
}

export default FormModal