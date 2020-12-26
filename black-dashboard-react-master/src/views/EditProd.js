import React from 'react';
// import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import apiClient from '../services/api';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import {
  Table,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Input,
  Row,
  Col,

} from "reactstrap";
import CardImg from 'reactstrap/lib/CardImg';
export default function ViewProd(props) {
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState();

 function editProductPic () {
  
    const fd = new FormData();
    fd.append('image', image);
    fd.append("prod_id",props.product.id)
      if (sessionStorage.getItem('loggedIn')) {
        apiClient.post('/api/editProductPic', fd)
            .then(()=>{props.onImageUpdate();})

                  .catch(error => console.error(error)
                  )

      }
  }
  const handleClickOpen = () => {
      setOpen(true);
    
  };

  const handleClose = () => {
      setOpen(false);
   
  };
  const handleSubmit = () => {
      setOpen(false);
      editProductPic();
    

  };

 
  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);
  return (
    <div>


      <HtmlTooltip
        title={
          <React.Fragment>
            <Typography color="inherit">{props.product.description}</Typography>

          </React.Fragment>
        }
      ><div>
        <Card>
    
         
          {props.product.pic_path != "" ? <CardImg onClick={handleClickOpen}
                                                  top style={{ width: "100%", height: "40%" }}
                                                  src={props.product.pic_path} /> : <Button onClick={handleClickOpen}><i className="tim-icons icon-cloud-upload-94" /> upload an image</Button>}
           
         
          <CardHeader tag="h4">
            {props.product.name}
          </CardHeader>
          <CardBody>
            <Row>

              <Col>
                <p>selling Price: {props.product.price}</p>
              </Col>
              <Col>
                <p>Available Qty: {props.product.qty}</p>
              </Col>
            </Row>
          </CardBody>
        </Card>
        </div>
      </HtmlTooltip>


       <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.product.name}</DialogTitle>
        <DialogContent>
          <Input type="file" onChange={(e)=>{setImage(e.target.files[0])}}/>
                
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Upload image
          </Button>
        </DialogActions>
      </Dialog> 
    </div>
  );
}
