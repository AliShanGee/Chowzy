import React, { useState, useRef, useEffect } from "react";
import BootstrapCard from "react-bootstrap/Card";
import { useDispatchCart,useCart } from "./ContextReducer";
export default function Card(props) {
let dispatch = useDispatchCart();
let data = useCart();
    const [qty, setQty] = useState(1);
    const [size, setSize] = useState("");
    const priceRef = useRef();

    let options = props.options || {};
    let priceOptions = Object.keys(options);
    let foodItem = props.foodItem;

    const handleAddToCart = async () => {
        // Logic for adding to cart will go here
        await dispatch({type:"ADD",id:props.foodItem._id,name:props.foodItem.name,price:finalPrice,qty:qty,size:size})
        console.log(data)
    };

    let finalPrice = qty * parseInt(options[size]);

    useEffect(() => {
        setSize(priceRef.current.value)
    }, [])

    return (
        <BootstrapCard className="m-3" style={{ width: "18rem", minHeight: "400px" }} data-aos="fade-up">
            <BootstrapCard.Img variant="top" src={foodItem.img} style={{ height: '180px', objectFit: 'cover' }} />
            <BootstrapCard.Body className="d-flex flex-column">
                <BootstrapCard.Title>{foodItem.name}</BootstrapCard.Title>
                <BootstrapCard.Text>
                    {foodItem.description}
                </BootstrapCard.Text>
                <div className="mt-auto">
                    <select className="m-2 h-100 bg-success rounded" onChange={(e) => setQty(e.target.value)}>
                        {Array.from(Array(6), (e, i) => {
                            return (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            );
                        })}
                    </select>
                    <select className="m-2 h-100 bg-success rounded" ref={priceRef} onChange={(e) => setSize(e.target.value)}>
                        {priceOptions.map((data) => {
                            return <option key={data} value={data}>{data}</option>
                        })}
                    </select>
                    <div className="d-inline h-100 fs-5">PKR{finalPrice}/-</div>
                </div>
                <hr />
                <button className={'btn btn-success justify-center ms-2'} onClick={handleAddToCart}>Add to Cart</button>
            </BootstrapCard.Body>
        </BootstrapCard>
    );
}
