import { compare } from "bcryptjs";
import React, { useEffect, useState } from "react";
import { IUser, UserState } from "../../types";
import Layout from "../ui/Layout";
import InputMask from "react-input-mask";
import InputError from "../ui/InputError";
import { useDispatch, useSelector } from "react-redux";
import { editUserAction } from "../../store/actions/userActions";
import { useNavigate } from "react-router-dom";
const EditUser = () => {
  
  //* Global user
  const { user, isAuth } = useSelector((state: UserState) => state);

  //* Check if auth
  useEffect(()=> {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth])

  //* state
  const [newUser, setNewUser] = useState({
    ...user,
    new_password: "",
    confirm_password: "",
  });

  //! error state
  const [ error, setError ] = useState(false);

  //* Extracting values
  const { email, name, telephone, user_name, password,role, new_password, confirm_password } = newUser;

  //* handling input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  //* Check for empty values
  const isEmpty = Object.values(newUser).some( v => {
    if( v === '') {
      return true;
    }
    return false;
  })

  //* Dispatch
  const dispatch = useDispatch();

  //* Navigate
  const navigate = useNavigate();

  //* handling submit
  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isSame = await compare(String(password), String(user.password))

    if( isEmpty || isSame || new_password !== confirm_password) {
      setError(true);
      return;
    }

    setError(false);

    const payload: IUser = {
      id: user.id,
      name,
      email,
      user_name,
      password: new_password,
      telephone,
      role
    }

    console.log(payload);
    dispatch( editUserAction( payload ) );

    navigate('/user');
  };

  return (
    <Layout>
      <div className="container px-5 my-5">
        <h1 className="text-center mb-4">Edit Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              value={email}
              onChange={handleChange}
              className="form-control"
              name="email"
              type="email"
              placeholder="Email Address"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              value={name}
              onChange={handleChange}
              className="form-control"
              name="name"
              type="text"
              placeholder="Name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="telephone">
              Telephone
            </label>
            <InputMask
              mask={"999-999-9999"}
              value={telephone}
              onChange={handleChange}
              className="form-control"
              name="telephone"
              type="text"
              placeholder="Telephone"
              required
            >
              {(inputProps: any) => <input {...inputProps} type={"tel"} />}
            </InputMask>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="user_name">
              User Name
            </label>
            <input
              value={user_name}
              onChange={handleChange}
              className="form-control"
              name="user_name"
              type="text"
              placeholder="User Name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              New Password
            </label>
            <input
              value={new_password}
              onChange={handleChange}
              className="form-control"
              name="new_password"
              type="password"
              placeholder="Password"
              minLength={8}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Confirm Password
            </label>
            <input
              value={confirm_password}
              onChange={handleChange}
              className="form-control"
              name="confirm_password"
              type="password"
              placeholder="Password"
              minLength={8}
              required
            />
            {(confirm_password !== new_password) && <InputError active={true} message="Passwords must match" />}
          </div>
          
          {error && <InputError active={error} message="Must fill all fields" />}
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
export default EditUser;
