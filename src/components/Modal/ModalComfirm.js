import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalComfirm = (props) => {

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn muốn xóa người dùng : {props.dataModal.email} ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={props.confirmDeleteUser}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalComfirm