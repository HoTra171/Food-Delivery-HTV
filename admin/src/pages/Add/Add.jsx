import React from 'react'
import { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets.js'
import axios from 'axios'
import { toast } from 'react-toastify'


const Add = ({ url }) => {

    const [image, setImage] = useState(false)
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        thoihansudung: "",
    })

    const onChangeHandler = (e) => {
        const name = e.target.name
        const value = e.target.value
        setData((data) => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", Number(data.price))
        formData.append("category", data.category)
        formData.append("image", image)
        formData.append("thoihansudung", data.thoihansudung)
        const token = localStorage.getItem("token");
        const response = await axios.post(`${url}/api/food/add`, formData, { headers: { token } })
        console.log(response.data);
        if (response.data.success) {
            setData({
                name: "",
                description: "",
                price: "",
                category: "Salad",
                thoihansudung: "",
            })
            setImage(false)
            console.log(response.data)
            toast.success(response.data.message)
        } else {
            toast.error(response.data.message)
        }
    }

    return (
        <div className="add">
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
                </div>
                <div className="add-product-name flex-col">
                    <p>Product name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
                </div>
                <div className="add-product-description flex-col">
                    <p>Product description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here'></textarea>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select onChange={onChangeHandler} name="category">
                            <option value="Salad">Salad</option>
                            <option value="Đồ uống">Đồ uống</option>
                            <option value="Đồ ăn nhanh">Đồ ăn nhanh</option>
                            <option value="Cơm">Cơm</option>
                            <option value="Phở">Phở</option>
                            <option value="Cháo">Cháo</option>
                            <option value="Thịt gà">Thịt gà</option>
                            <option value="Mỳ">Mỳ</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product price</p>
                        <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder='20000 VNĐ' />
                    </div>
                    <div className="add-thoihansudung">
                        <p>Thời hạn sử dụng</p>
                        <input type="date" onChange={onChangeHandler} name='thoihansudung' value={data.thoihansudung} />
                    </div>
                </div>
                <button type='submit' className="add-btn">ADD</button>
            </form>
        </div>
    )
}

export default Add
