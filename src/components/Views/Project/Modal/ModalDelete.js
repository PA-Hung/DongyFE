import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalDelete = (props) => {

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title className='title-modal'>Xác nhận xóa bệnh nhân</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có muốn xóa bệnh nhân : {props.dataModal.name} ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Không xóa
                    </Button>
                    <Button variant="primary" onClick={props.confirmModalDelete}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDelete