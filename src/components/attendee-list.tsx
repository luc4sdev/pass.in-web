import { Search, MoreHorizontal, ChevronsLeft, ChevronRight, ChevronsRight, ChevronLeft } from 'lucide-react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Attendee {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    checkedInAt: string | null;
}

export function AttendeeList() {

    const [search, setSearch] = useState(() => {
        const url = new URL(window.location.toString())

       if(url.searchParams.has('search')) {
        return url.searchParams.get('search') ?? ''
       }

       return ''
    })

    const [page, setPage] = useState(() => {
        const url = new URL(window.location.toString())

       if(url.searchParams.has('page')) {
        return Number( url.searchParams.get('page'))
       }

       return 1
    })

    const [total, setTotal] = useState(0)
    const [attendees, setAttendees] = useState<Attendee[]>([])

    useEffect(() => {
        const url = new URL('https://pass-in-node.onrender.com/events/9a391a85-eea9-4c72-bf91-c9f8682f5fe0/attendees')
        url.searchParams.set('pageIndex', String(page - 1))

        if(search.length > 0) {
            url.searchParams.set('query', search)
        }

        fetch(url)
        .then(response => response.json())
        .then(data => {
            setAttendees(data.attendees)
        })
    }, [page, search])

    useEffect(() => {
        fetch('https://pass-in-node.onrender.com/events/9a391a85-eea9-4c72-bf91-c9f8682f5fe0')
        .then(response => response.json())
        .then(data => {
            setTotal(data.event.attendeesAmount)
        })
    }, [])

    const totalPages = Math.ceil(total / 10)


    function setCurrentSearch(search: string) {
        const url = new URL(window.location.toString())

        url.searchParams.set('search', search)

        window.history.pushState({}, "", url)

        setSearch(search)
    }

    function setCurrentPage(page: number) {
        const url = new URL(window.location.toString())

        url.searchParams.set('page', String(page))

        window.history.pushState({}, "", url)

        setPage(page)
    }

    function onSearchInputChandged(event: ChangeEvent<HTMLInputElement>) {
        setCurrentSearch(event.target.value)
        setCurrentPage(1)
    }

    function goToFirstPage() {
        setCurrentPage(1)
    }

    function goToNextPage() {
     
        setCurrentPage(page + 1)
    }

    function goToPreviousPage() {
        setCurrentPage(page - 1)
    }

    function goToLastPage() {
        setCurrentPage(totalPages)

    }
    
    return (
        <div className='flex flex-col gap-4'>
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participantes</h1>

                <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg flex items-center gap-3">
                    <Search className='size-4 text-emerald-300' />
                    <input onChange={onSearchInputChandged} value={search} className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0 focus:ring-offset-0" placeholder="Buscar participante..." />
                </div>
            </div>

            <Table>

                <thead>
                    <tr className='border-b border-white/10'>
                        <TableHeader style={{ width: 48 }} className='py-3 px-4 text-sm font-semibold text-left'>
                            <input className='size-4 bg-black/20 rounded border border-white/10 focus:ring-0 focus:ring-offset-0 checked:text-orange-400' type="checkbox" />
                        </TableHeader>

                        <TableHeader>Código</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data de inscrição</TableHeader>
                        <TableHeader>Data do check-in</TableHeader>
                        <TableHeader style={{ width: 64 }} ></TableHeader>
                    </tr>
                </thead>

                <tbody>
                    {attendees.map((attendee) => {
                        return (
                            <TableRow key={attendee.id} className='border-b border-white/10 hover:bg-white/5'>
                                <TableCell>
                                    <input className='size-4 bg-black/20 rounded border border-white/10 focus:ring-0 focus:ring-offset-0 checked:text-orange-400' type="checkbox" />
                                </TableCell>

                                <TableCell>{attendee.id}</TableCell>

                                <TableCell>
                                    <div className='flex flex-col gap-1'>
                                        <span className='font-semibold text-white'>{attendee.name}</span>
                                        <span>{attendee.email}</span>
                                    </div>
                                </TableCell>

                                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>

                                <TableCell>
                                    {attendee.checkedInAt === null 
                                    ? <span className='text-zinc-400'>Não fez check-in</span> 
                                    : dayjs().to(attendee.checkedInAt)
                                    }
                                    </TableCell>

                                <TableCell>
                                    <IconButton transparent>
                                        <MoreHorizontal className='size-4' />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </tbody>


                <tfoot>
                    <tr>
                        <TableCell colSpan={3}>
                            Mostrando {attendees.length} de {total} itens
                        </TableCell>
                        <TableCell className='text-right' colSpan={3}>
                            <div className='inline-flex items-center gap-8'>
                                <span>Página {page} de {totalPages}</span>

                                <div className='flex gap-1.5'>
                                    <IconButton onClick={goToFirstPage} isButtondisabled={page === 1}>
                                        <ChevronsLeft className='size-4' />
                                    </IconButton>

                                    <IconButton onClick={goToPreviousPage} isButtondisabled={page === 1}>
                                        <ChevronLeft className='size-4' />
                                    </IconButton>

                                    <IconButton onClick={goToNextPage} isButtondisabled={page === totalPages}>
                                        <ChevronRight className='size-4' />
                                    </IconButton>

                                    <IconButton onClick={goToLastPage} isButtondisabled={page === totalPages}>
                                        <ChevronsRight className='size-4' />
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>


            </Table>
        </div>
    )
}