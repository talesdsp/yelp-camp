import { Form } from "@unform/web";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import API from "../../api";
import Input from "../../components/Input";
import { pagesActions } from "../../store/ducks/page";
import { usersActions } from "../../store/ducks/user";

export default function SignIn() {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    API.checkUser().then((res) => {
      res.data.id && history.replace("/campgrounds");
    });
    dispatch(pagesActions.signIn());
  }, [dispatch]);

  return (
    <div className="row">
      <h1 style={{ textAlign: "center" }}>Sign In</h1>
      <div style={{ width: "30%", margin: "25px auto" }}>
        <Unform></Unform>
        <a href="/campgrounds">Go Back</a>
      </div>
    </div>
  );
}

function Unform() {
  const formRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();

  async function handleSubmit(data) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("not a valid email")
          .required("email is required"),
        password: Yup.string().required("password is required"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const res = await API.signIn(data);

      dispatch(usersActions.signIn(res.data));

      history.push("/campgrounds");

      window.flash("User signed successfully", "success");
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};
        err.inner.forEach((error) => {
          errorMessages[error.path] = error.message;
        });
        formRef.current.setErrors(errorMessages);
      } else {
        window.flash("email or password invalid", "danger");
      }
    }
  }
  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Input label="Email" name="email" />
      <Input label="Password" type="password" name="password" />

      <button type="submit">Send</button>
    </Form>
  );
}
