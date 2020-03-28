import { Form } from "@unform/web";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import API from "../../../../api";
import Input from "../../../../components/Input";

export default function NewComment({ match }) {
  const [campground, setCampground] = useState({});

  useEffect(() => {
    API.showCamp(match)
      .then((res) => setCampground(res.data))
      .catch((err) => window.location.reload());
  }, [match]);

  return (
    <div className="row">
      <h1 style={{ textAlign: "center" }}>Add New Comment to {campground.name} </h1>
      <div style={{ width: "30%", margin: "25px auto" }}>
        <Unform campground={campground} />
        <a href="/campgrounds">Go Back</a>
      </div>
    </div>
  );
}

function Unform({ campground }) {
  const history = useHistory();
  const formRef = useRef(null);

  async function handleSubmit(data) {
    try {
      const schema = Yup.object().shape({});

      await schema.validate(data, {
        abortEarly: false,
      });

      await API.addComment(campground, data);

      history.push(`/campgrounds/${campground._id}`);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};
        err.inner.forEach((error) => {
          errorMessages[error.path] = error.message;
        });
        formRef.current.setErrors(errorMessages);
      } else {
        window.flash("comment not added", "danger");
      }
    }
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Input label="Text" name="text" />
      <button type="submit">Send</button>
    </Form>
  );
}
