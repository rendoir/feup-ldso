import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, FormGroup,  Image, Col, Button, Row, Breadcrumb, Alert, FormControl } from 'react-bootstrap';
import { Dropdown } from 'semantic-ui-react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import './AddEventForm.css';

const initialState = {
    title: "",
    description: "",
    image: "",
    startDate: "",
    endDate: "",
    location: "",
    price: 0,
    displayImage: "",
    chosenEntity: null,
    alertType: null,
    alertMessage: null,
    eventAdded: false
}

function getTokenFromCookie() {
    let token = document.cookie.split("access_token=")[1];
    return token;
}

class AddEventForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: "",
            description: "",
            image: "",
            startDate: "",
            endDate: "",
            location: "",
            price: 0,
            displayImage: "",
            chosenEntity: null,
            alertType: null,
            alertMessage: null,
            eventAdded: false
        }

        this.updateTitle = this.updateTitle.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.updateStartDate = this.updateStartDate.bind(this);
        this.updateEndDate = this.updateEndDate.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.updatePrice = this.updatePrice.bind(this);
        this.handleChangeEntity = this.handleChangeEntity.bind(this);
        this.addEventAction = this.addEventAction.bind(this);
        this.findIDEntity = this.findIDEntity.bind(this);

    }


    updateTitle(event) {
        this.setState({ title: event.target.value });
    }

    updateDescription(event) {
        this.setState({ description: event.target.value });
    }

    updateImage(event) {
        this.setState({ image: event.target.files[0], displayImage: URL.createObjectURL(event.target.files[0]) });
    }

    updateStartDate(event) {
        this.setState({ startDate: event.target.value });
    }

    updateEndDate(event) {
        this.setState({ endDate: event.target.value });
    }

    updateLocation(event) {
        this.setState({ location: event.target.value });
    }

    updatePrice(event) {
        this.setState({ price: event.target.value });
    }

    handleChangeEntity(event) {
        let element = document.querySelector("#add-event-entity div.text");
        if (element !== null) {
            let value = this.findIDEntity(element.innerHTML);
            if (value !== -1) {
                this.setState({ chosenEntity: value })
            }
        }
    }

    findIDEntity(entity) {
        for (let i = 0; i < this.props.entities.length; i++) {
            if (this.props.entities[i].text === entity) {
                return this.props.entities[i].value;
            }
        }
        return -1;
    }

    addEventAction(event) {
        event.preventDefault();

        let categoryDropdown = document.querySelectorAll("#add-event-category > a");
        let categories = [];
        for (let i = 0; i < categoryDropdown.length; i++) {
            categories[i] = parseInt(categoryDropdown[i].getAttribute('value'));
        }

        if (this.state.chosenEntity === null) {
            this.setState({ alertType: "danger", alertMessage: 'Escolha uma entidade, por favor.' });
            return;
        }
        if (categories.length === 0) {
            this.setState({ alertType: "danger", alertMessage: 'Não é possível criar um evento sem categorias.' });
            return;
        }

        var data = new FormData();
        data.append('title', this.state.title);
        data.append('description', this.state.description);
        data.append('start_date', this.state.startDate);
        data.append('end_date', this.state.endDate);
        data.append('location', this.state.location);
        data.append('image', this.state.image);
        data.append('price', this.state.price);
        data.append('categories', categories);
        data.append('entity_id', this.state.chosenEntity)

        axios({
            method: 'POST',
            url: 'http://localhost:3030/',
            headers: { 'Content-Type': 'multipart/form-data' ,
             'Authorization': "Bearer " + getTokenFromCookie()},
            data: data
        })
            .then((res) => {
                let entityElement = document.querySelector("#add-event-entity div.text");
                if (entityElement !== null) {
                    entityElement.setAttribute("class", "text default");
                    entityElement.innerHTML = "Entidade"
                }
                this.setState({ ...initialState, eventAdded: true, alertType: "success", alertMessage: 'O evento foi adicionado!' });
            })
            .catch((error) => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. O evento não foi adicionado.' }));

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.alertMessage === null && this.state.alertMessage !== null) {
            setTimeout(() => {
                this.setState({ alertMessage: null, alertType: null });
            }, 3000);
        }

        if (prevProps.entities.length !== this.props.entities.length && this.props.entities.length === 1) {
            this.setState({ chosenEntity: this.props.entities[0].value });
        }
    }

    render() {

        if(document.cookie === undefined || 
            document.cookie.indexOf("access_token=") === -1) return <Redirect to={'/'} />;

        let alertElement = null;
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
        if (this.props.entities.length > 1) {
            entityElement = (<Dropdown placeholder='Entidade' id="add-event-entity" search fluid
                selection options={this.props.entities} onChange={this.handleChangeEntity} />)
        }
        else if (this.props.entities.length > 0) {
            entityElement = (<span>{this.props.entities[0].text}</span>)
        }

        return (
            <div id="add_event_form_div">
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
                            <Breadcrumb.Item active>Criar Evento</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col sm={4} md={2}>

                    </Col>
                </Row>
                <Row>
                    <Col sm={1} md={1}>

                    </Col>
                    <Col sm={10} md={10}>
                        <Form onSubmit={this.addEventAction} id="add_event_form">
                            <FormGroup controlId="form-title">
                                <Row>
                                    <Col sm={2} className="align_left"><Form.Label>Título do Evento: </Form.Label></Col>
                                    <Col sm={5}>
                                        <FormControl type="text" required value={this.state.title} onChange={this.updateTitle} />
                                    </Col>
                                    <Col sm={5} className="dropdowns-search" id="dropdowns-add-event">
                                        {entityElement}
                                    </Col>
                                </Row>
                            </FormGroup>

                            <FormGroup controlId="form-descriptionAndImage">
                                <Row>
                                    <Col sm={8} className="align_left">
                                        <Form.Label>Descrição do Evento: </Form.Label>
                                        <FormControl as="textarea" required rows="10" value={this.state.description} onChange={this.updateDescription} />
                                    </Col>
                                    <Col sm={4}>
                                        <FormGroup controlId="form-image" id="form-image-div">
                                            <Form.Label className="text-align-center">Inserir Imagem: </Form.Label>
                                            <FormControl type="file" name="file" onChange={this.updateImage} className="inputfile" />
                                            <label htmlFor="form-image" className="btn">Escolha um ficheiro</label>
                                            <Image src={this.state.displayImage} className="preview_image" />

                                        </FormGroup>
                                    </Col>
                                </Row>

                            </FormGroup>

                            <FormGroup controlId="form-datesLabel" className="text-align-center">
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
                            <FormGroup controlId="form-dates" id="form-dates-div">
                                <Row>
                                    <Col sm={2} className="align_left">
                                        <Form.Label>Data/Hora:</Form.Label>
                                    </Col>
                                    <Col sm={3}>
                                        <FormGroup controlId="form-date-start">
                                            <FormControl required type="datetime-local" value={this.state.startDate} onChange={this.updateStartDate} />
                                        </FormGroup>
                                    </Col>
                                    <Col sm={2} className="text-align-center">
                                        <Form.Label> a </Form.Label>
                                    </Col>
                                    <Col sm={3}>
                                        <FormGroup controlId="form-date-end">
                                            <FormControl required type="datetime-local" value={this.state.endDate} onChange={this.updateEndDate} />
                                        </FormGroup>
                                    </Col>
                                    <Col sm={2}></Col>
                                </Row>
                            </FormGroup>
                            <FormGroup controlId="form-location">
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
                                    <Col sm={5} id="add-event-form-categories-div" >
                                        <Dropdown placeholder='Categorias' id="add-event-category" fluid multiple search selection options={this.props.categories} />
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
                                            type="number" min="0" value={this.state.price} onChange={this.updatePrice} />
                                    </Col>
                                </Row>
                            </FormGroup>

                            <FormGroup controlId="form-buttons" className="buttons_style">
                                <Button variant="secondary">
                                <Link to={`/events`}>
                                    <Button variant="secondary">Cancelar</Button>
                                </Link>
                                </Button>
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

export default AddEventForm;
