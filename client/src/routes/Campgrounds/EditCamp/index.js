import { Form } from "@unform/web";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import API from "../../../api";
import Input from "../../../components/Input";

export default function EditCamp({ match }) {
  const [campground, setCampground] = useState({});

  return (
    <div className="row">
      <h1 style={{ textAlign: "center" }}>Edit {campground.name}</h1>
      <div style={{ width: "30%", margin: "25px auto" }}>
        <Unform setCampground={setCampground} match={match} />
        <a href="/campgrounds">Go Back</a>
      </div>
    </div>
  );
}

function Unform({ setCampground, match }) {
  const [campground, updateCampground] = useState({});
  const history = useHistory();
  const formRef = useRef(null);

  useEffect(() => {
    API.showCamp(match).then((res) => {
      setCampground(res.data);
      updateCampground(res.data);
      formRef.current.setData(res.data);
    });
  }, []);

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

      await API.updateCamp(match, data);

      window.flash("Camp Updated successfully", "success");
      history.push(`/campgrounds/${campground._id}`);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};
        err.inner.forEach((error) => {
          errorMessages[error.path] = error.message;
        });
        formRef.current.setErrors(errorMessages);
      } else {
        console.log(err);
        window.flash("Oops some error ocurred", "danger");
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
