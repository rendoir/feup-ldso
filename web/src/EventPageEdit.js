import React, { Component } from 'react';
import { Form, FormGroup, Image, Col, Button, Row, Breadcrumb, Alert, FormControl } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import axios from 'axios';
import './EventPageEdit.css';

function getTokenFromCookie() {
    let token = document.cookie.split("access_token=")[1];
    return token;
}

class EventPageEdit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            title: "",
            title_english: "",
            description: "",
            description_english: "",
            entity_id: "",
            chosenEntity: null,
            endDate: "",
            startDate: "",
            location: "",
            price: 0,
            chosenCategories: [],
            image: "http://" + process.env.REACT_APP_API_URL + ":3030/" + props.match.params.id,
            displayImage: "",
            alertType: null,
            alertMessage: null,
            errorLoadingImage: true,
            redirect: false
        };

        this.updateTitle = this.updateTitle.bind(this);
        this.updateTitleEnglish = this.updateTitleEnglish.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.updateDescriptionEnglish = this.updateDescriptionEnglish.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.updateStartDate = this.updateStartDate.bind(this);
        this.updateEndDate = this.updateEndDate.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.updatePrice = this.updatePrice.bind(this);
        this.handleChangeEntity = this.handleChangeEntity.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.goBack = this.goBack.bind(this);
        this.editEventAction = this.editEventAction.bind(this);
    }

    componentDidMount() {
        axios.get('http://' + process.env.REACT_APP_API_URL + ':3030/events/' + this.state.id)
            .then((res) => {

                if (res.data === "" || Object.keys(res.data).length === 0) {
                    this.setState({ alertType: "danger", alertMessage: "Este evento não existe." });
                } else {

                    let date = new Date(res.data.start_date);
                    let dd = date.getDate();
                    let mm = date.getMonth();
                    let yyyy = date.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    let stringDateStart = yyyy + "-" + mm + "-" + dd + "T" + (date.getHours() < 10 ? '0' : '') + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

                    let stringDateEnd = null;
                    if (res.data.end_date !== null) {
                        date = new Date(res.data.end_date);
                        dd = date.getDate();
                        mm = date.getMonth() + 1;
                        yyyy = date.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd;
                        }
                        if (mm < 10) {
                            mm = '0' + mm;
                        }
                        stringDateEnd = yyyy + "-" + mm + "-" + dd + "T" + (date.getHours() < 10 ? '0' : '') + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
                    }
                    let startDate = stringDateStart;
                    let endDate = stringDateEnd;
                    let chosenCategories = res.data.categories.map((cat) => ({ value: cat.id, label: cat.name }));

                    this.setState({
                        title: res.data.title,
                        title_english: res.data.title_english,
                        description: res.data.description,
                        description_english: res.data.description_english,
                        startDate: startDate,
                        endDate: endDate,
                        location: res.data.location,
                        price: res.data.price,
                        chosenEntity: { value: res.data.entity.id, label: res.data.entity.initials },
                        entity_id: res.data.entity_id,
                        chosenCategories: chosenCategories
                    });

                }

            })
            .catch(() => {
                this.setState({ alertType: "danger", alertMessage: "Ocorreu um erro. Por favor tente novamente." });
            });
    }

    updateTitle(event) {
        this.setState({ title: event.target.value });
    }

    updateTitleEnglish(event) {
        this.setState({ title_english: event.target.value });
    }

    updateDescription(event) {
        this.setState({ description: event.target.value });
    }

    updateDescriptionEnglish(event) {
        this.setState({ description_english: event.target.value });
    }

    updateStartDate(event) {
        this.setState({ startDate: event });
    }

    updateEndDate(event) {
        this.setState({ endDate: event });
    }

    updateLocation(event) {
        this.setState({ location: event.target.value });
    }

    updatePrice(event) {
        this.setState({ price: event.target.value });
    }

    updateImage(event) {
        this.setState({ image: event.target.files[0], displayImage: URL.createObjectURL(event.target.files[0]) });
    }

    handleChangeEntity(event) {
        this.setState({ chosenEntity: event });
    }

    handleChangeCategory(event) {
        this.setState({ chosenCategories: event });
    }

    goBack() {
        this.props.history.goBack();
    }

    editEventAction(event) {
        event.preventDefault();

        if (this.state.chosenEntity === null) {
            this.setState({ alertType: "danger", alertMessage: 'Escolha uma entidade, por favor.' });
            return;
        }
        if (this.state.chosenCategories.length === 0) {
            this.setState({ alertType: "danger", alertMessage: 'Não é possível editar um evento sem categorias.' });
            return;
        }

        let categories = this.state.chosenCategories.map((cat) => cat.value);

        var data = new FormData();
        data.append('title', this.state.title);
        data.append('title_english', this.state.title_english);
        data.append('description', this.state.description);
        data.append('description_english', this.state.description_english);
        data.append('start_date', this.state.startDate);
        data.append('end_date', this.state.endDate);
        data.append('location', this.state.location);
        data.append('image', this.state.image);
        data.append('price', this.state.price);
        data.append('categories', categories);
        data.append('entity_id', this.state.chosenEntity.value);

        axios({
            method: "PUT",
            url: "http://" + process.env.REACT_APP_API_URL + ":3030/events/" + this.state.id,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': "Bearer " + getTokenFromCookie()
            },
            data: data
        })
            .then(() => this.setState({ redirect: true, displayImage: "" }))
            .catch(() => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. O evento não foi editado. Tente novamente.' }));
    }


    render() {

        if (this.state.redirect) {
            return <Redirect to={{ pathname: `/events/${this.state.id}`, state: { updateImage: true } }} push />;
        }

        let alertElement;
        if (this.state.alertMessage !== null) {
            alertElement = (
                <Row>
                    <Col sm={4} md={2}>

                    </Col>
                    <Col sm={5} md={8}>
                        <Alert className={this.state.alertType}>
                            {this.state.alertMessage}
                        </Alert>
                    </Col>
                    <Col sm={4} md={2}>
                    </Col>
                </Row>);
        }

        let entityElement;
        if (this.props.allEntities.length > 1) {
            entityElement = (
                <Select
                    placeholder="Entidade"
                    id="edit-event-entity"
                    classNamePrefix="entities"
                    isSearchable="true"
                    value={this.state.chosenEntity}
                    onChange={this.handleChangeEntity}
                    options={this.props.allEntities}
                />);
        } else if (this.props.allEntities.length > 0) {
            entityElement = (<span>{this.props.allEntities[0].text}</span>);
        }


        if (this.state.title === "") {
            return (
                <div className="loading">
                    <div className="loader"></div>
                </div>
            );
        } else {

            return (
                <div id="edit_event_form_div">
                    {alertElement}
                    <Row>
                        <Col sm={4} md={2}>

                        </Col>
                        <Col sm={5} md={8}>
                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <Link to={`/events`}>
                                        Eventos
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to={`/events/${this.state.id}`}>
                                        {this.state.title}
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item active>Editar</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col sm={4} md={2}>

                        </Col>
                    </Row>
                    <Row>
                        <Col sm={1} md={1}>

                        </Col>
                        <Col sm={10} md={10}>
                            <Form onSubmit={this.editEventAction} id="edit_event_form">
                                <FormGroup controlId="edit-form-title">
                                    <Row>
                                        <Col sm={2}><Form.Label>Título do Evento: </Form.Label></Col>
                                        <Col sm={5}>
                                            <FormControl type="text" required value={this.state.title} onChange={this.updateTitle} />
                                        </Col>
                                        <Col sm={5} className="dropdowns-search" id="dropdowns-edit-event">
                                            {entityElement}
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup controlId="edit-form-title-english">
                                    <Row>
                                        <Col sm={2} className="align_left"><Form.Label>Título do Evento (Inglês): </Form.Label></Col>
                                        <Col sm={5}>
                                            <FormControl type="text" required value={this.state.title_english} onChange={this.updateTitleEnglish} />
                                        </Col>
                                        <Col sm={5}></Col>
                                    </Row>
                                </FormGroup>

                                <FormGroup controlId="edit-form-descriptionAndImage">
                                    <Row>
                                        <Col sm={4} className="align_left">
                                            <Form.Label>Descrição do Evento: </Form.Label>
                                            <FormControl as="textarea" required rows="10" value={this.state.description} onChange={this.updateDescription} />
                                        </Col>
                                        <Col sm={4} className="align_left">
                                            <Form.Label>Descrição do Evento (Inglês): </Form.Label>
                                            <FormControl as="textarea" className="description_english" required rows="10" value={this.state.description_english} onChange={this.updateDescriptionEnglish} />
                                        </Col>
                                        <Col sm={4}>
                                            <FormGroup controlId="edit-form-image" id="edit-form-image-div">
                                                <Form.Label className="text-align-center">Inserir Imagem: </Form.Label>
                                                <FormControl type="file" name="file" onChange={this.updateImage} className="inputfile" />
                                                <label htmlFor="edit-form-image" className="btn">Escolha um ficheiro</label>
                                                <Image src={this.state.displayImage === "" ? this.state.image : this.state.displayImage} className="preview_image" />

                                            </FormGroup>
                                        </Col>
                                    </Row>

                                </FormGroup>

                                <FormGroup controlId="edit-form-datesLabel" className="text-align-center">
                                    <Row>
                                        <Col sm={2}></Col>
                                        <Col sm={3}>
                                            <Form.Label>Início</Form.Label>
                                        </Col>
                                        <Col sm={2}> </Col>
                                        <Col sm={3}>
                                            <Form.Label>Fim</Form.Label>
                                        </Col>
                                        <Col sm={2}></Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup controlId="edit-form-dates" id="form-dates-div">
                                    <Row>
                                        <Col sm={2} className="align_left">
                                            <Form.Label>Data/Hora:</Form.Label>
                                        </Col>
                                        <Col sm={3}>
                                            <FormGroup controlId="edit-form-date-start">
                                                <Flatpickr data-enable-time
                                                    className="form-control start-date-edit"
                                                    value={this.state.startDate}
                                                    onChange={this.updateStartDate} />
                                            </FormGroup>
                                        </Col>
                                        <Col sm={2} className="text-align-center">
                                            <Form.Label> a </Form.Label>
                                        </Col>
                                        <Col sm={3}>
                                            <FormGroup controlId="edit-form-date-end">
                                                <Flatpickr data-enable-time
                                                    className="form-control end-date-edit"
                                                    value={this.state.endDate}
                                                    onChange={this.updateEndDate} />
                                            </FormGroup>
                                        </Col>
                                        <Col sm={2}></Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup controlId="edit-form-location">
                                    <Row>
                                        <Col sm={1} className="align_left">
                                            <Form.Label>Localização: </Form.Label>
                                        </Col>
                                        <Col sm={5}>
                                            <FormControl type="text" required value={this.state.location} onChange={this.updateLocation} />
                                        </Col>
                                        <Col sm={1} className="align_left">
                                            <Form.Label>Categorias: </Form.Label>
                                        </Col>
                                        <Col sm={5} id="edit-event-form-categories-div" >
                                            <Select
                                                placeholder="Categorias"
                                                id="edit-event-category"
                                                isMulti="true"
                                                classNamePrefix="categories"
                                                closeMenuOnSelect={false}
                                                value={this.state.chosenCategories}
                                                onChange={this.handleChangeCategory}
                                                options={this.props.allCategories}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup controlId="form-price">
                                    <Row>
                                        <Col sm={1} className="align_left">
                                            <Form.Label>Preço: </Form.Label>
                                        </Col>
                                        <Col sm={5}>
                                            <input className="form-control"
                                                type="number" min="0" step=".01" value={this.state.price} onChange={this.updatePrice} />
                                        </Col>
                                    </Row>
                                </FormGroup>

                                <FormGroup controlId="edit-form-buttons" className="buttons_style">
                                    <Button variant="secondary" onClick={this.goBack}>Cancelar</Button>
                                    <Button variant="primary" type="submit" className="primary_button">Confirmar</Button>
                                </FormGroup>

                            </Form>
                        </Col>
                        <Col sm={1} md={1}>

                        </Col>
                    </Row>
                </div>
            );

        }

    }
}

export default EventPageEdit;
