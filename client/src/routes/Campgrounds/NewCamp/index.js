import { Form } from "@unform/web";
import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import API from "../../../api";
import Input from "../../../components/Input";

export default function NewCamp() {
  return (
    <section className="row">
      <h1 style={{ textAlign: "center" }}>Create a New Campground</h1>
      <div style={{ width: "30%", margin: "25px auto" }}>
        <Unform />
        <a href="/campgrounds">Go Back</a>
      </div>
    </section>
  );
}

function Unform() {
  const history = useHistory();
  const formRef = useRef(null);

  async function handleSubmit(data) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .min(3)
          .required("a name is required"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const res = await API.createCamp(data);

      if (res.status === 400) {
        throw new Error();
      }

      history.push("/campgrounds");
      window.flash("Camp created successfully", "success");
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};
        err.inner.forEach((error) => {
          errorMessages[error.path] = error.message;
        });
        formRef.current.setErrors(errorMessages);
      } else {
        window.flash("Camp not created", "danger");
      }
    }
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Input label="Name" name="name" />
      <Input label="Image" name="image" />
      <Input label="Location" name="location" />
      <Input label="Description" name="description" />
      <button type="submit">Send</button>
    </Form>
  );
}
