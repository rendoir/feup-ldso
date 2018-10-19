import React, { Component } from 'react';
import { Form, Image, Col, Button, Row, Breadcrumb, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import './AddEventForm.css';

class AddEventForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: "",
            description: "",
            image: "",
            start_date: "",
            end_date: "",
            location: "",
            price: 0,
            displayImage: "",
            alertType: null,
            alertMessage: null
        }

        this.updateTitle = this.updateTitle.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.updateStartDate = this.updateStartDate.bind(this);
        this.updateEndDate = this.updateEndDate.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
        this.updatePrice = this.updatePrice.bind(this);
        this.addEventAction = this.addEventAction.bind(this);

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
        this.setState({ start_date: event.target.value });
    }

    updateEndDate(event) {
        this.setState({ end_date: event.target.value });
    }

    updateLocation(event) {
        this.setState({ location: event.target.value });
    }

    updatePrice(event) {
        this.setState({ price: event.target.value });
    }

    addEventAction(event) {
        event.preventDefault();

        var data = new FormData();
        data.append('title', this.state.title);
        data.append('description', this.state.description);
        data.append('start_date', this.state.start_date);
        data.append('end_date', this.state.end_date);
        data.append('location', this.state.location);
        data.append('image', this.state.image);
        data.append('price', this.state.price);

        axios({
            method: 'POST',
            url: 'http://192.168.99.100:3030/',
            config: { headers: { 'Content-Type': 'multipart/form-data' } },
            data: data
        })
            .then((res) => this.setState({alertType: "success", alertMessage:'O evento foi adicionado!'}))
            .catch((error) => this.setState({alertType: "danger", alertMessage: 'Ocorreu um erro. O evento não foi adicionado.'}));

    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.alertMessage === null && this.state.alertMessage !== null) {
            setTimeout(() => {
                this.setState({alertMessage: null, alertType: null});
            }, 3000);
        }
    }


    render() {

        let alertElement;
        if(this.state.alertMessage !== null) {
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

        return (
            <div id="add_event_form_div">
                {alertElement}
                <Row>
                    <Col sm={4} md={2}>

                    </Col>
                    <Col sm={5} md={8}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="#">Eventos</Breadcrumb.Item>
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
                            <Form.Group controlId="form.Title">
                                <Row>
                                    <Col sm={2} className="align_left"><Form.Label>Título do Evento: </Form.Label></Col>
                                    <Col sm={5}>
                                        <Form.Control type="text" value={this.state.title} onChange={this.updateTitle} />
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group controlId="form.descriptionAndImage">
                                <Form.Row>o
                                    <Col sm={8} className="align_left">
                                        <Form.Label>Descrição do Evento: </Form.Label>
                                        <Form.Control as="textarea" rows="10" value={this.state.description} onChange={this.updateDescription} />
                                    </Col>
                                    <Col sm={4}>
                                        <Form.Label>Inserir Imagem: </Form.Label>
                                        <Form.Control type="file" name="file" onChange={this.updateImage} id="file" className="inputfile" />
                                        <label htmlFor="file" className="btn">Escolha um ficheiro</label>
                                        <Image src={this.state.displayImage} className="preview_image" />
                                    </Col>
                                </Form.Row>

                            </Form.Group>

                            <Form.Group controlId="form.Dates">
                                <Form.Row>
                                    <Col sm={1}></Col>
                                    <Col sm={3}>
                                        <Form.Label>Início</Form.Label>
                                    </Col>
                                    <Col sm={1}> </Col>
                                    <Col sm={3}>
                                        <Form.Label>Fim</Form.Label>
                                    </Col>
                                </Form.Row>
                                <Form.Row>
                                    <Col sm={1} className="align_left">
                                        <Form.Label>Data/Hora:</Form.Label>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Control type="datetime-local" value={this.state.start_date} onChange={this.updateStartDate} />
                                    </Col>
                                    <Col sm={1}>
                                        <Form.Label> a </Form.Label>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Control type="datetime-local" value={this.state.end_date} onChange={this.updateEndDate} />
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                            <Form.Group controlId="form.Location">
                                <Row>
                                    <Col sm={1} className="align_left">
                                        <Form.Label>Localização: </Form.Label>
                                    </Col>
                                    <Col sm={5}>
                                        <Form.Control type="text" value={this.state.location} onChange={this.updateLocation} />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group controlId="form.Price">
                                <Row>
                                    <Col sm={1} className="align_left">
                                        <Form.Label>Preço: </Form.Label>
                                    </Col>
                                    <Col sm={5}>
                                        <Form.Control type="number" min="0" value={this.state.price} onChange={this.updatePrice} />
                                    </Col>
                                </Row>
                            </Form.Group>

                            <Form.Group controlId="form.Buttons" className="buttons_style">
                                <Button variant="secondary">Cancelar</Button>
                                <Button variant="primary" type="submit" className="primary_button">Confirmar</Button>
                            </Form.Group>

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
