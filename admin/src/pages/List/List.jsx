import React, { useEffect } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = () => {

  const url = 'http://localhost:4000'
  const [list, setList] = React.useState([])

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if(response.data.success) {
      setList(response.data.data)
    } else {
      toast.error('Error list')
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {id:foodId})
    console.log(response)
    await fetchList()
    console.log(response.data)
    if(response.data.success) {
      toast.success(response.data.message)
    } else {
      toast.error(response.data.error)
    }
  }
  
  useEffect(() => {
    fetchList()
  },[])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (  
          <div className="list-table-format" key={index}>
            <img src={`${url}/images/` + item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price}</p>
            <button onClick={()=>removeFood(item.id)} className='delete'>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List
