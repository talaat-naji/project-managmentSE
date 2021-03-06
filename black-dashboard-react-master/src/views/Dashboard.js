/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

import apiClient from "../services/api";
// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import Button2 from '@material-ui/core/Button';
import CustomersTable from "./CustomerTable";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4
} from "variables/charts.js";

// chartExample1 and chartExample2 options


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
      myData: [],
      myDailyData: [],
      stock: [],
      stockTotal: [],
      customers: [],
      customersTable:[],
      yearlyProfit: [],
      open: false,
      ind: null,
      month:""
    };
    this.chart1_2_options = {
      maintainAspectRatio: false,
      onClick: (e, element) => {
        if (element.length > 0) {
          let ind = element[0]._index;
          this.setState({ open: true ,ind:ind+1})
          this.fetchDailyData(ind);
        }
      },
      
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        userCallback: function(value, index, values) {
          value = value.toString();
          value = value.split(/(?=(?:...)*$)/);
          value = value.join(',');
          return value;
      },
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.0)",
              zeroLineColor: "transparent"
            },
            ticks: {
              suggestedMin: 60,
              userCallback: function(value, index, values) {
                value = value.toString();
                value = value.split(/(?=(?:...)*$)/);
                value = value.join(',');
                return value;
            },
              suggestedMax: 125,
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ],
        xAxes: [
          {
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent"
            },
            ticks: {
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }
        ]
      }
    };
  }
  fetchDailyData = (ind) => {
    if (sessionStorage.getItem('loggedIn')) {
      apiClient.post('../api/getDailyData', { monthNb:ind+1,  bigChartData: this.state.bigChartData})
        .then(response => {
          this.fixDailyData(response.data)
        })
        .catch(error => console.error(error))

    }
  }
 
  fixDailyData(data) {
    let date = new Date("2020/" + this.state.ind + "/1")
    let shortMonth = date.toLocaleString('en-us', { month: 'long' });
    this.setState({ month:shortMonth});
    let sumArr = [];
   let  lastday =new Date(data[0].year, data[0].month, 0).getDate();
    for (var i = 1; i <= lastday; i++) {
      let j = 0;
      let sum = 0;
      while (j < data.length) {
        if (data[j]['day'] == i) {
          sum += data[j]['sales'];

        }

        j++;
      }

      sumArr.push({ sales: sum, day: i });
    }
   
    this.setState({ myDailyData: sumArr ,month:shortMonth});
   
  }
  fixMyData = (data) => {
    let sumArr = [];
    for (var i = 1; i <= 12; i++) {
      let j = 0;
      let sum = 0;
      while (j < data.length) {
        if (data[j]['month'] == i) {
          sum += data[j]['sales'];
        }

        j++;
      }

      sumArr.push(sum);
    }

    this.setState({ myData: sumArr })
  }
  fixCustomerCount = (data) => {

    let sumArr = [];
    let i = 0;
    let j = 0;

    for (var a = data[0]['month']; a < data[0]['month'] + 12; a++) {
      let count = 0;
      if (a <= 12) {
        i = a;
      } else { i = a - 12 }

      

      if (data[j]['month'] == i) {
        
        count += data[j]['customerCount'];
       
        if (j + 1 < data.length) {
          j++;
        }
      }
      let date = new Date("2020/" + i + "/2")
      let shortMonth = date.toLocaleString('en-us', { month: 'short' });
      let obj = { count: count, month: shortMonth };


      sumArr.push(obj);
    }
    this.setState({ customers: sumArr })

  }
  fixYearlyProfit(data) {
    let sumArr = [];
    for (var i = data[data.length - 1]['year'] - 10; i <= data[data.length - 1]['year']; i++) {
      let j = 0;
      let sum = 0;
      while (j < data.length) {
        if (data[j]['year'] == i) {
          sum += data[j]['profits'];

        }

        j++;
      }

      sumArr.push({ sum: sum, year: i });
    }

    this.setState({ yearlyProfit: sumArr })
  }
  fetchSales = () => {
    if (sessionStorage.getItem('loggedIn')) {
      apiClient.get('../api/getSales')
        .then(response => {
          this.fixMyData(response.data);
        })
        .catch(error => console.error(error))

    }

  }
  fetchProfits = () => {
    if (sessionStorage.getItem('loggedIn')) {
      apiClient.get('../api/getProfit')
        .then(response => {
          this.fixMyData(response.data);
        })
        .catch(error => console.error(error))

    }

  }
  fetchYearlyProfits = () => {
    if (sessionStorage.getItem('loggedIn')) {
      apiClient.get('../api/getYearlyProfit')
        .then(response => {
          this.fixYearlyProfit(response.data);
        })
        .catch(error => console.error(error))

    }

  }

  fetchStockValue = () => {
    if (sessionStorage.getItem('loggedIn')) {
      apiClient.get('../api/getStockValue')
        .then(response => {

          this.setState({ stockTotal: response.data });
        })
        .catch(error => console.error(error))

    }

  }
  fetchStock = () => {
    if (sessionStorage.getItem('loggedIn')) {
      apiClient.get('../api/getStock')
        .then(response => {
          //  console.log(response.data);
          this.setState({ stock: response.data })
        })
        .catch(error => console.error(error))

    }

  }
  fetchCustomersCount = () => {
    if (sessionStorage.getItem('loggedIn')) {
      apiClient.get('../api/getCustomersCount')
        .then(response => {
          
          this.fixCustomerCount(response.data)
        })
        .catch(error => console.error(error))

    }

  }
  fetchCustomersTable = () => {
    if (sessionStorage.getItem('loggedIn')) {
      apiClient.get('../api/getCustomersTable')
        .then(response => {
           //console.log(response.data);
       this.setState({ customersTable: response.data })
        })
        .catch(error => console.error(error))

    }

  }
  componentDidMount() {
    
    this.fetchSales();
    this.fetchStockValue();
    this.fetchStock();
    this.fetchCustomersCount();
    this.fetchYearlyProfits();
    this.fetchCustomersTable();
  }
  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });
  };
 
handleClose = () => {
  this.setState({
    open: false,
    myDailyData: [],
    month: "",
    inv:null
  });
 
};
  render() {

    return (
      <>
        <div className="content">
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth={true} >
        <DialogTitle id="form-dialog-title" style={{ backgroundColor: "#c9d0b6" }}>
          <Button2 onClick={this.handleClose} color="primary">
            <i className="tim-icons icon-minimal-left"/>
              </Button2>{this.state.month} {this.state.bigChartData === "data1" ? "Sales" : "Profits"}</DialogTitle>
        <DialogContent style={{ backgroundColor: "#f5f6fa" }}>
        <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                     
                      <CardTitle tag="h2">{this.state.bigChartData === "data1" ? "Daily Sales" : "Daily Profits"}</CardTitle>
                    </Col></Row></CardHeader><CardBody>
              <div className="chart-area">
                    <Line
                      data={{
                        labels:
                          this.state.myDailyData.map((days)=>{return days.day}),
                        datasets: [
                          {
                            label: this.state.bigChartData === "data1" ? "Sales" : "Profits",
                            fill: true,
                            backgroundColor: "powderblue",
                            borderColor: "#1f8ef1",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: "#1f8ef1",
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: "#1f8ef1",
                            pointBorderWidth: 20,
                            pointHoverRadius: 4,
                            pointHoverBorderWidth: 15,
                            pointRadius: 4,
                            data: this.state.myDailyData.map((sales)=>{return sales.sales})
                          }
                        ]
                      }
                      }
                      options={chartExample3.options}

                    />

                  </div>
                </CardBody>
                </Card>
        </DialogContent>
       
      </Dialog>
          <Row>
            <Col xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                      <h5 className="card-category">Total Shipments</h5>
                      <CardTitle tag="h2">Performance</CardTitle>
                    </Col>
                    <Col sm="6">
                      <ButtonGroup
                        className="btn-group-toggle float-right"
                        data-toggle="buttons"
                      >
                        <Button
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data1"
                          })}
                          color="info"
                          id="0"
                          size="sm"
                          onClick={() => { this.setBgChartData("data1"); this.fetchSales() }}
                        >
                          <input
                            defaultChecked
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Sales
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-single-02" />
                          </span>
                        </Button>
                        <Button
                          color="info"
                          id="1"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data2"
                          })}
                          onClick={() => { this.setBgChartData("data2"); this.fetchProfits() }}
                        >
                          <input
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Profits
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-gift-2" />
                          </span>
                        </Button>

                      </ButtonGroup>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={{
                        labels: [
                          "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
                        ],
                        datasets: [
                          {
                            label:this.state.bigChartData === "data1" ? "click for daily Sales" : "click for daily Profits" ,
                            fill: true,
                            backgroundColor: "powderblue",
                            borderColor: "#1f8ef1",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: "#1f8ef1",
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: "#1f8ef1",
                            pointBorderWidth: 20,
                            pointHoverRadius: 4,
                            pointHoverBorderWidth: 15,
                            pointRadius: 4,
                            data: this.state.myData
                          }
                        ]
                      }
                      }
                      options={this.chart1_2_options}

                    />

                  </div>

                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Customers sold /month</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-bell-55 text-info" />{" "}
                    763,215
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={{
                        labels: this.state.customers.map((data2) => { return data2.month }),
                        datasets: [
                          {
                            label: "Data",
                            fill: true,
                            backgroundColor: "powderblue",
                            borderColor: "#1f8ef1",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: "#1f8ef1",
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: "#1f8ef1",
                            pointBorderWidth: 20,
                            pointHoverRadius: 4,
                            pointHoverBorderWidth: 15,
                            pointRadius: 4,
                            data: this.state.customers.map((data2) => { return data2.count })
                          }
                        ]
                      }}
                      options={this.chart1_2_options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h3 className="card-category">Stock Content</h3>
                  <CardTitle tag="h4">
                    {/* <i className="tim-icons icon-delivery-fast text-primary" />{" "} */}
                   <Row><Col> <p style={{fontSize:"15px"}}> Selling value:</p></Col><Col> <p>{this.state.stockTotal.saleValue>0?this.state.stockTotal.saleValue.toLocaleString():"0"} L.L</p></Col></Row>
                   <Row><Col> <p style={{fontSize:"15px"}}> Cost value: </p></Col><Col> <p>{this.state.stockTotal.costValue>0?this.state.stockTotal.costValue.toLocaleString():"0"} L.L</p></Col></Row>

                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Bar
                      data={{
                        labels: this.state.stock.map((data2) => { return data2.products.map((d) => { return d.name }) }),
                        datasets: [
                          {
                            label: "Products",
                            fill: true,
                            backgroundColor: "violete",
                            hoverBackgroundColor: "purple",
                            borderColor: "#d048b6",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            data: this.state.stock.map((data2) => { return data2.qty })
                          }
                        ]
                      }}
                      options={chartExample3.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Yearly Profits</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-send text-success" />
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={{
                        labels: this.state.yearlyProfit.map((data2) => { return data2.year }),
                        datasets: [
                          {
                            label: "year",
                            fill: true,
                            backgroundColor: "powderblue",
                            borderColor: "#00d6b4",
                            borderWidth: 2,
                            borderDash: [],
                            borderDashOffset: 0.0,
                            pointBackgroundColor: "#00d6b4",
                            pointBorderColor: "rgba(255,255,255,0)",
                            pointHoverBackgroundColor: "#00d6b4",
                            pointBorderWidth: 20,
                            pointHoverRadius: 4,
                            pointHoverBorderWidth: 15,
                            pointRadius: 4,
                            data: this.state.yearlyProfit.map((data2) => { return data2.sum })
                          }
                        ]
                      }}
                      options={this.chart1_2_options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
           
            {/* <Col lg="6" md="12"> */}
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Customers Table</CardTitle>
              </CardHeader>
              <CardBody>
               <CustomersTable customersData={this.state.customersTable}/>
              </CardBody>
            </Card>
            {/* </Col> */}
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;

 {/* <Col lg="6" md="12">
              <Card className="card-tasks">
                <CardHeader>
                  <h6 className="title d-inline">Tasks(5)</h6>
                  <p className="card-category d-inline"> today</p>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      caret
                      className="btn-icon"
                      color="link"
                      data-toggle="dropdown"
                      type="button"
                    >
                      <i className="tim-icons icon-settings-gear-63" />
                    </DropdownToggle>
                    <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Action
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Another action
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Something else
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </CardHeader>
                <CardBody>
                  <div className="table-full-width table-responsive">
                    <Table>
                      <tbody>
                        <tr>
                          <td>
                            <FormGroup check>
                              <Label check>
                                <Input defaultValue="" type="checkbox" />
                                <span className="form-check-sign">
                                  <span className="check" />
                                </span>
                              </Label>
                            </FormGroup>
                          </td>
                          <td>
                            <p className="title">Update the Documentation</p>
                            <p className="text-muted">
                              Dwuamish Head, Seattle, WA 8:47 AM
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <Button
                              color="link"
                              id="tooltip636901683"
                              title=""
                              type="button"
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip636901683"
                              placement="right"
                            >
                              Edit Task
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <FormGroup check>
                              <Label check>
                                <Input
                                  defaultChecked
                                  defaultValue=""
                                  type="checkbox"
                                />
                                <span className="form-check-sign">
                                  <span className="check" />
                                </span>
                              </Label>
                            </FormGroup>
                          </td>
                          <td>
                            <p className="title">GDPR Compliance</p>
                            <p className="text-muted">
                              The GDPR is a regulation that requires businesses
                              to protect the personal data and privacy of Europe
                              citizens for transactions that occur within EU
                              member states.
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <Button
                              color="link"
                              id="tooltip457194718"
                              title=""
                              type="button"
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip457194718"
                              placement="right"
                            >
                              Edit Task
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <FormGroup check>
                              <Label check>
                                <Input defaultValue="" type="checkbox" />
                                <span className="form-check-sign">
                                  <span className="check" />
                                </span>
                              </Label>
                            </FormGroup>
                          </td>
                          <td>
                            <p className="title">Solve the issues</p>
                            <p className="text-muted">
                              Fifty percent of all respondents said they would
                              be more likely to shop at a company
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <Button
                              color="link"
                              id="tooltip362404923"
                              title=""
                              type="button"
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip362404923"
                              placement="right"
                            >
                              Edit Task
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <FormGroup check>
                              <Label check>
                                <Input defaultValue="" type="checkbox" />
                                <span className="form-check-sign">
                                  <span className="check" />
                                </span>
                              </Label>
                            </FormGroup>
                          </td>
                          <td>
                            <p className="title">Release v2.0.0</p>
                            <p className="text-muted">
                              Ra Ave SW, Seattle, WA 98116, SUA 11:19 AM
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <Button
                              color="link"
                              id="tooltip818217463"
                              title=""
                              type="button"
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip818217463"
                              placement="right"
                            >
                              Edit Task
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <FormGroup check>
                              <Label check>
                                <Input defaultValue="" type="checkbox" />
                                <span className="form-check-sign">
                                  <span className="check" />
                                </span>
                              </Label>
                            </FormGroup>
                          </td>
                          <td>
                            <p className="title">Export the processed files</p>
                            <p className="text-muted">
                              The report also shows that consumers will not
                              easily forgive a company once a breach exposing
                              their personal data occurs.
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <Button
                              color="link"
                              id="tooltip831835125"
                              title=""
                              type="button"
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip831835125"
                              placement="right"
                            >
                              Edit Task
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <FormGroup check>
                              <Label check>
                                <Input defaultValue="" type="checkbox" />
                                <span className="form-check-sign">
                                  <span className="check" />
                                </span>
                              </Label>
                            </FormGroup>
                          </td>
                          <td>
                            <p className="title">Arival at export process</p>
                            <p className="text-muted">
                              Capitol Hill, Seattle, WA 12:34 AM
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <Button
                              color="link"
                              id="tooltip217595172"
                              title=""
                              type="button"
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip217595172"
                              placement="right"
                            >
                              Edit Task
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col> */}