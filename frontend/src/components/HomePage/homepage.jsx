import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component'
import { getColumns } from "./helpers";
import { Input } from "reactstrap";
import { Search } from 'react-feather'


function HomePage(){

    const navigate = useNavigate()
    const userApi = useApi().root
    const [datas, setDatas] = useState([])
    const [searchValue, setSearchValue] = useState('')

    async function IsLogged(){
        const data = await userApi.logged()
    }

    async function getData(){
        const data = await userApi.systemdata(searchValue)
        if (data['is_success']){
            setDatas(data['data'])
        }
    }
    useEffect(() => {
        IsLogged(),
        getData()
    }, [])

    async function LogOut(){
        const data = await userApi.logout()
        if (data['is_success']){
            navigate('/login')
        }
    }

    async function handleSearch() {
        getData()
    }

    const handleFilter = e => {
        const value = e.target.value.trimStart();
        setSearchValue(value)
    }

    return (
        <div className="">
            <div className="flex flex-row justify-around">
                <span className="basis-1/4">Системүүдийн мэдээлэл</span>
                <button onClick={LogOut} className="basis-1/4 border rounded-md bg-blue-950 px-1 text-white">Гарах</button>
            </div>
            <div className='d-flex align-items-center mt-1' md={6} sm={12}>
                <Input
                    className='border rounded-md'
                    type='text'
                    bsSize='sm'
                    id='search-input'
                    placeholder={'Хайх'}
                    value={searchValue}
                    onChange={handleFilter}
                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                />
                <button
                    size='sm'
                    className=''
                    color='primary'
                    onClick={handleSearch}
                >
                    <Search size={15} className="ms-2"/>
                    <span></span>
                </button>
            </div>
            <DataTable
                className="react-dataTable"
                columns={getColumns()}
                data={datas}
                noDataComponent={
                    <span>Өгөгдөл алга байна</span>
                }
            />
        </div>
    )
}

export default HomePage;
