import { Form } from "@unform/web";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import API from "../../api";
import Input from "../../components/Input";
import { pagesActions } from "../../store/ducks/page";
import { usersActions } from "../../store/ducks/user";

export default function Register() {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    API.checkUser().then((res) => {
      res.data.id && history.replace("/campgrounds");
    });
    dispatch(pagesActions.register());
  }, [dispatch]);

  return (
    <div className="row">
      <h1 style={{ textAlign: "center" }}>Sign Up</h1>
      <div style={{ width: "30%", margin: "25px auto" }}>
        <Unform />
        <a href="/campgrounds">Go Back</a>
      </div>
    </div>
  );
}

function Unform() {
  const history = useHistory();
  const formRef = useRef(null);
  const dispatch = useDispatch();

  async function handleSubmit(data) {
    try {
      const schema = Yup.object().shape({
        username: Yup.string()
          .min(3)
          .required("username is required"),
        email: Yup.string()
          .email("email not valid")
          .required("email required"),
        password: Yup.string()
          .min(3)
          .required("password is required"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const res = await API.createUser(data);
      if (res.status >= 400) throw new Error(res.data.message);

      dispatch(usersActions.register(res.data));
      history.push("/campgrounds");
      window.flash("User registered successfully", "success");
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};
        err.inner.forEach((error) => {
          errorMessages[error.path] = error.message;
        });
        formRef.current.setErrors(errorMessages);
      } else {
        window.flash(err.message, "danger");
      }
    }
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Input label="Username" name="username" />
      <Input label="Email" name="email" />
      <Input label="Password" type="password" name="password" />

      <button type="submit">Send</button>
    </Form>
  );
}
