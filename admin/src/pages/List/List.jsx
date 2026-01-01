import React, { useEffect } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({ url }) => {

  const [list, setList] = React.useState([])
  const [editingId, setEditingId] = React.useState(null);
  const [editData, setEditData] = React.useState({
    name: '',
    category: '',
    description: '',
    price: '',
    thoihansudung: '',
    });
  const startEdit = (item) => {
    setEditingId(item._id);
    setEditData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      thoihansudung: item.thoihansudung,
    });
  };

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if (response.data.success) {
      setList(response.data.data)
    } else {
      toast.error('Error list')
    }
  }

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
    await fetchList()
    console.log(response.data)
    if (response.data.success) {
      toast.success(response.data.message)
    } else {
      toast.error(response.data.error)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const updateFood = async () => {
    try {
      const response = await axios.post(`${url}/api/food/update`, {
        id: editingId,
        ...editData
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingId(null);
        fetchList(); // load lại danh sách mới
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error('Update failed');
    }
  };


  return (
    <div className='list add flex-col'>
      <p style={{ fontWeight: 700, fontSize: 20 }}>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Description</b>
          <b>Price</b>
          <b>Thời hạn sử dụng</b> 
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div className="list-table-format" key={index}>
            <img src={`${url}/images/` + item.image} alt="" />

            {editingId === item._id ? (
              <input
                type="text"
                value={editData.name}
                onChange={e => setEditData({ ...editData, name: e.target.value })}
              />
            ) : (
              <p>{item.name}</p>
            )}

            {editingId === item._id ? (
              <select
                value={editData.category}
                onChange={e => setEditData({ ...editData, category: e.target.value })}
              >
                  <option value="Salad">Salad</option>
                  <option value="Đồ uống">Đồ uống</option>
                  <option value="Đồ ăn nhanh">Đồ ăn nhanh</option>
                  <option value="Cơm">Cơm</option>
                  <option value="Phở">Phở</option>
                  <option value="Cháo">Cháo</option>
                  <option value="Thịt gà">Thịt gà</option>
                  <option value="Mỳ">Mỳ</option>
                </select>
                ) : (
                <p>{item.category}</p>
            )}

                {editingId === item._id ? (
                  <textarea
                    style={{ width: "120px", height: "50px" }}
                    type="text"
                    value={editData.description}
                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                  />
                ) : (
                  <p className='list-table-format-description'>{item.description}</p>
                )}

                {editingId === item._id ? (
                  <input
                    type="number"
                    value={editData.price}
                    onChange={e => setEditData({ ...editData, price: e.target.value })}
                  />
                ) : (
                  <p>{item.price}</p>
                )}
                <p>{item.thoihansudung}</p>

                <div className="list-table-format-action">
                  {editingId === item._id ? (
                    <>
                      <button onClick={updateFood} className="edit">Save</button>
                      <button onClick={() => setEditingId(null)} className="delete">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(item)} className="edit">Edit</button>
                      <button onClick={() => removeFood(item._id)} className="delete">Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
    </div>
      )
}

      export default List
