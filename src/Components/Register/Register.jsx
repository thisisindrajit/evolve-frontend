import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./register.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Loading from "../../Utils/Loading";
import LogoHolder from "../LogoHolder/LogoHolder";
import InputHolder from "../InputHolder";
// import CountrySelector from "../CountrySelector";
import { useTitle } from "../../Services/useTitle";

const Register = (props) => {
  useTitle("Register - Evolve");

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({ isSet: false, errorDesc: "" });
  const [buttonText, setButtonText] = useState("REGISTER");

  // if already logged in, redirect directly to dashboard
  if (props.isAuthenticated) {
    let uid = localStorage.getItem("userID");
    return <Redirect to={`/dashboard/${uid}`} />;
  }

  const errorSet = (desc) => {
    setError({ isSet: true, errorDesc: desc });
  };

  const changeData = (e, type) => {
    setData({
      firstName: type === 1 ? e.target.value : data.firstName,
      lastName: type === 2 ? e.target.value : data.lastName,
      // location: type === 3 ? e.target.value : data.location,
      email: type === 4 ? e.target.value : data.email,
      password: type === 5 ? e.target.value : data.password,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setButtonText("REGISTERING...");

    const REGISTER_ENDPOINT = process.env.REACT_APP_API_URL + "/register.php";

    try {
      let response = await axios.post(REGISTER_ENDPOINT, data);

      // there is an error
      if (response.data.error !== undefined) {
        document.getElementsByClassName("holder")[0].scrollIntoView();

        // changing button text
        setButtonText("REGISTER");

        // resetting the form
        setData({
          firstName: "",
          lastName: "",
          location: "",
          email: "",
          password: "",
        });

        // setting the error
        errorSet(response.data.error);
        return;
      } else if (response.status === 200 && response.data.userData.token) {
        let jwt = response.data.userData.token;
        let uid = response.data.userData.uid;
        let username = response.data.userData.name;

        localStorage.setItem("access_token", jwt);
        localStorage.setItem("userID", uid);
        localStorage.setItem("username", username);

        //setting authenticated to true
        props.register();
      }
    } catch (e) {
      // changing button text
      setButtonText("REGISTER");
      errorSet("Some error occured while registering!");
      console.error(e);
    }
  };

  return props.loading === true ? (
    <Loading />
  ) : (
    <div className="flex flex-col min-h-screen pb-4 md:pb-8">
      <LogoHolder type="register" />
      <div className="m-auto holder px-4 py-8 xsm:px-6 sm:px-10 w-11/12 sm:w-10/12 md:w-6/12 xl:w-5/12">
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="text-lg sm:text-xl md:text-2xl">
            Become an Evolve member
          </div>

          {/*Vertical line*/}
          <div className="my-6 bg-evolve-green h-px w-full"></div>

          {/*error box*/}
          {error.isSet && (
            <div className="border-2 border-red-500 text-white p-2 w-full sm:w-10/12 text-center my-2 md:text-base text-sm">
              {error.errorDesc}
            </div>
          )}

          <InputHolder title="First name" isRequired>
            <input
              type="text"
              title="First Name"
              name="firstname"
              value={data.firstName}
              placeholder="Enter your first name"
              onChange={(e) => changeData(e, 1)}
              spellCheck="false"
              className="input-field"
              required
            />
          </InputHolder>
          <InputHolder title="Last name">
            <input
              type="text"
              title="Last Name"
              name="lastname"
              value={data.lastName}
              placeholder="Enter your last name"
              onChange={(e) => changeData(e, 2)}
              className="input-field"
              spellCheck="false"
            />
          </InputHolder>
          {/* Change location to set of options only */}
          {/* <InputHolder
            title="Country"
            isRequired
            showInfo
            info="This data is used to select the apt currency for you."
          >
            <CountrySelector
              value={data.location}
              onChange={(e) => changeData(e, 3)}
            />
          </InputHolder> */}
          <InputHolder title="Email ID" isRequired>
            <input
              type="email"
              title="Email"
              name="email"
              value={data.email}
              placeholder="Enter your email ID"
              onChange={(e) => changeData(e, 4)}
              spellCheck="false"
              className="input-field"
              required
            />
          </InputHolder>
          <InputHolder title="Password" isRequired>
            <input
              type="password"
              title="Password"
              name="password"
              value={data.password}
              placeholder="Enter your password"
              onChange={(e) => changeData(e, 5)}
              className="input-field"
              required
            />
          </InputHolder>
          <button type="submit" className="w-full sm:w-10/12">
            <div className="border-2 border-white p-4 font-bold my-2 hover:text-white hover:bg-evolve-green hover:border-evolve-green transition-all text-sm flex items-center justify-center gap-2">
              {/* Loading icon */}
              {buttonText === "REGISTERING..." && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  className="h-5 w-5"
                >
                  <path
                    fill="white"
                    d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
                  >
                    <animateTransform
                      attributeType="xml"
                      attributeName="transform"
                      type="rotate"
                      from="0 25 25"
                      to="360 25 25"
                      dur="0.6s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              )}
              {buttonText}
            </div>
          </button>
          <span className="text-sm mt-6">
            Already registered?{" "}
            <Link to="/login" className="text-evolve-green hover:underline">
              Click Here
            </Link>{" "}
            to Login!
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
