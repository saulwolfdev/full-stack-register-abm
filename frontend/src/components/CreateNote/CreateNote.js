import React, { Component, Fragment } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import styles from "./CreateNote.module.scss";
class CreateNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userSelected: "",
      name: "",
      email: "",
      content: "",
      cuit: "",
      direction: "",
      phone: "",
      date: new Date(),
      editingNote: false,
      message: false,
      _id: "",
    };
  }
  async componentDidMount() {
    // console.log(" aca viene la url=>",this.props.match.params.id)
    const res = await axios.get("http://localhost:4000/api/users");
    this.setState({
      users: res.data.map((user) => user.username),
      userSelected: res.data[0].username,
    });
    if (this.props.match.params.id) {
      const res = await axios.get(
        "http://localhost:4000/api/notes/" + this.props.match.params.id
      );
      console.log("data res==>>>", res.data);
      this.setState({
        name: res.data.name,
        email: res.data.email,
        content: res.data.content,
        direction: res.data.direction,
        phone: res.data.phone,
        cuit: res.data.cuit,
        date: new Date(res.data.date),
        userSelected: res.data.registeredManager,
        editingNote: true,
        _id: this.props.match.params.id,
      });
    }
  }
  onSubmit = async (e) => {
    e.preventDefault();
    const newNote = {
      name: this.state.name,
      email: this.state.email,
      direction: this.state.direction,
      phone: this.state.phone,
      content: this.state.content,
      date: this.state.date,
      cuit: this.state.cuit,
      registeredManager: this.state.userSelected,
    };
    if (this.state.editingNote) {
      await axios.put(
        "http://localhost:4000/api/notes/" + this.state._id,
        newNote
      );
    } else {
      try {
        const res = await axios.post(
          "http://localhost:4000/api/notes",
          newNote
        );
        console.log("nota creada OK", res);
        window.location = "/";
      } catch (error) {
        if (error.response.data.name === "DuplicateError") {
          //   console.log(error.response.data.name);
          this.setState({ message: true });
          setTimeout(() => this.setState({ message: false }), 1000);
        } else throw error;
      }
    }
  };
  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onDateChange = (date) => {
    this.setState({ date });
  };
  render() {
    return (
      <Fragment>
        <div className="container">
          <div className="col-md-6 offset-md-3">
            <div className="card card-body">
              <h4>INGRESAR PROVEEDOR</h4>
              {this.state.message ? <h3>EL CUIT YA ESTA INSCRIPTO</h3> : null}
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre"
                    onChange={this.onInputChange}
                    name="name"
                    value={this.state.name}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Correo"
                    onChange={this.onInputChange}
                    name="email"
                    value={this.state.email}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Dirección"
                    onChange={this.onInputChange}
                    name="direction"
                    value={this.state.direction}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Telefono"
                    onChange={this.onInputChange}
                    name="phone"
                    value={this.state.phone}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cuit"
                    onChange={this.onInputChange}
                    name="cuit"
                    value={this.state.cuit}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    type="text"
                    className="form-control"
                    placeholder="Información adicional"
                    name="content"
                    value={this.state.content}
                    onChange={this.onInputChange}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <DatePicker
                    className="form-control"
                    onChange={this.onDateChange}
                    selected={this.state.date}
                  />
                </div>
				<div className="form-group">
				<label>Seleccione responsable inscripto</label>
                  <select
                    className="form-control"
                    name="userSelected"
                    value={this.state.userSelected}
                    onChange={this.onInputChange}
                  >
                    {this.state.users.map((user) => {
                      return (
                        <option key={user} value={user} required>
                          {user}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="crear proveedor"
                />
              </form>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CreateNote;
