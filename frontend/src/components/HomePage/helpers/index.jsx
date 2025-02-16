import moment from 'moment';


const static_data = [
    {
        id: 1,
        name: 'Карт'
    },
    {
        id: 2,
        name: 'Коре'
    },
    {
        id: 3,
        name: 'Дотоод'
    },
    {
        id: 4,
        name: 'Дижитал'
    },
]

export function getColumns () {

    const columns = [
        {
            header: 'system_name',
            name: 'Системийн нэр',
            selector: (row) => (row?.system_name),
            center: true
        },
        {
            header: 'system_type',
            name: 'Системийн нэр',
            selector: (row) => {
                const type_name = static_data.filter((value) => value.id == row?.system_type)
                return type_name[0]?.name;
            },
            center: true
        },
        {
            header: 'price',
            name: 'Системийн үнэлгээ',
            selector: (row) => (row?.price),
            center: true
        },
        {
            header: 'related_system',
            name: 'Холбоотой систем',
            selector: (row) => {
                name = ''
                if (row?.related_system_data){
                    row?.related_system_data.map((value) => {
                        name += value.system_name + ', '
                    })
                    name = name.substring(0, name.length - 2)
                }
                return name
            },
            center: true
        },
        {
            header: 'description',
            name: 'Тайлбар',
            selector: (row) => (row?.description),
            center: true
        },
        {
            header: 'date',
            name: 'Хугацаа',
            selector: (row) => (row?.date ? moment(row?.date).format('YYYY-MM-DD HH:mm:ss') : ''),
            center: true
        },
        {
            header: 'is_active',
            name: 'Ашиглагдаж байгаа эсэх ',
            selector: (row) => (row?.is_active ? 'Тийм' : 'Үгүй'),
            center: true
        }
    ]

    return columns
}