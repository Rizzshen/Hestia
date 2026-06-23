import { useParams } from 'react-router-dom'

const { id } = useParams()
// then fetch GET /orders/:id and GET /orders/:id/items using that id