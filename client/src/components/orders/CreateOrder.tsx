import React, { useEffect, useState } from "react";
import { IOrders, UserState } from "../../types";
import Layout from "../ui/Layout";
import InputMask from "react-input-mask";
import InputError from "../ui/InputError";
import { useDispatch, useSelector } from "react-redux";
import { createOrderAction } from "../../store/actions/userActions";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "../../config/isEmpty";

const CreateOrder = () => {
  //* Global user
  const { user, adresses, isAuth } = useSelector((state: UserState) => state);

  //* initial state
  const stateConfig: IOrders = {
    user_id: user.id,
    address_id: undefined,
    price: 0,
    name: "",
    rating: 0,
    manufacturer: "",
    item_info: "",
    quantity: 0,
  };

  //* Check if auth
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  //* state
  const [newOrder, setNewOrder] = useState<IOrders>(stateConfig);

  //! error state
  const [error, setError] = useState(false);

  //* Extracting values
  const { name, rating, price, manufacturer, item_info, quantity, address_id } =
    newOrder;

  //* handling input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOrder({
      ...newOrder,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewOrder({
      ...newOrder,
      [e.target.name]: e.target.value,
    });
  };

  //* Dispatch
  const dispatch = useDispatch();

  //* Navigate
  const navigate = useNavigate();
  //* handling submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEmpty(newOrder)) {
      setError(true);
      return;
    }

    setError(false);
    
    newOrder.address_id = Number(address_id);

    dispatch(createOrderAction(Number(user.id), newOrder));

    navigate("/orders");
  };

  return (
    <Layout>
      <div className="container px-5 my-5">
        <h1 className="text-center mb-4">Create Order</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              value={name}
              onChange={handleChange}
              className="form-control"
              name="name"
              placeholder="Name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="price">
              Price
            </label>
            <input
              value={price}
              onChange={handleChange}
              className="form-control"
              name="price"
              type="number"
              placeholder="Price"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="manufacturer">
              Manufacturer
            </label>
            <input
              value={manufacturer}
              onChange={handleChange}
              className="form-control"
              name="manufacturer"
              type="text"
              placeholder="Manufacturer"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="quantity">
              Quantity
            </label>
            <input
              value={quantity}
              onChange={handleChange}
              className="form-control"
              name="quantity"
              type="number"
              min={1}
              max={10}
              placeholder="Quantity"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="rating">
              Rating
            </label>
            <input
              value={rating}
              onChange={handleChange}
              className="form-control"
              name="rating"
              type="number"
              min={1}
              max={10}
              placeholder="Rating"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="item_info">
              Info about order
            </label>
            <input
              value={item_info}
              onChange={handleChange}
              className="form-control"
              name="item_info"
              type="text"
              placeholder="Info"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="address_id">
              Address
            </label>
            <select
              value={address_id}
              onChange={handleSelect}
              className="form-control"
              name="address_id"
              placeholder="Address"
            >
              <option value={""}></option>
              {adresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.address1}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <InputError active={error} message="Must fill all fields" />
          )}
          <div className="d-grid mt-4">
            <button
              className="btn btn-primary btn-lg"
              name="submitButton"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
export default CreateOrder;
