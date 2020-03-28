import { Form } from "@unform/web";
import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import API from "../../../../api";
import Input from "../../../../components/Input";

export default function EditComment({ match }) {
  return (
    <div className="row">
      <h1 style={{ textAlign: "center" }}>Edit Comment</h1>
      <div style={{ width: "30%", margin: "25px auto" }}>
        <Unform match={match}></Unform>
        <a href="/campgrounds">Go Back</a>
      </div>
    </div>
  );
}

function Unform({ match }) {
  const history = useHistory();
  const formRef = useRef(null);

  useEffect(() => {
    API.showComment(match).then((res) => {
      formRef.current.setData({ text: res.data.text });
    });
  }, [match]);

  async function handleSubmit(data) {
    try {
      const schema = Yup.object().shape({});

      await schema.validate(data, {
        abortEarly: false,
      });

      await API.updateComment(match, data);

      history.push("/campgrounds");
      window.flash("comment updated successfully", "success");
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};
        err.inner.forEach((error) => {
          errorMessages[error.path] = error.message;
        });
        formRef.current.setErrors(errorMessages);
      } else {
        window.flash("comment did not update", "danger");
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
