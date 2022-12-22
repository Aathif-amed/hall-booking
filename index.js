const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json())


let available_halls = [
    {
      hall_name: 'Standard',
      hall_id: 1,
      seats: 130,
      amenities: ["Projector","Surround Sound System"],
      price_per_hour: 2000,
    },
    {
      hall_name: 'VIP',
      hall_id: 2,
      seats: 150,
      amenities: ["Projector","Surround Sound System","A/C"],
      price_per_hour: 3500,
    },
  ];
  
  let bookingDetails = [
    {
      customerName: 'XXXX',
      hall_name: 'VIP',
      booked_hall_id: 1,
      date: new Date('2022-12-16'),
      start_time: '00:00',
      end_time: '23:00',
      status: 'booked',
    },
    {
      customerName: 'YYYY',
      hall_name: 'Standard',
      booked_hall_id: 2,
      date: new Date('2022-12-22'),
      start_time: '17:00',
      end_time: '09:00',
      status: 'booked',
    },
    {
      customerName: 'ZZZZ',
      hall_name: 'Standard',
      booked_hall_id: 2,
      date: new Date('2022-12-30'),
      start_time: '15:00',
      end_time: '10:00',
      status: 'booked',
    }
  ];
  
 
  
  app.get('/', (req, res) => {
    res.status(200).json({
      message: 'Welcome',
      To_create_a_hall: '/hall/create',
      To_book_a_hall: '/hall/book',
      booked_halls: ' /hall/booked-details',
      booked_customer: '/hall/customer-details',
    });
  });
 
  
  app.post('/hall/create', (req, res) => {
    let id = available_halls.length + 1;
    req.body.hall_id = id;
    try {
      
      available_halls.push({
        hall_name: req.body.hall_name,
        hall_id: req.body.hall_id,
        seats: req.body.seats,
        amenities: req.body.amenities,
        price_per_hour: req.body.price_per_hour,
      });
      res.status(201).json(`Hall was created successfully Hall ID:${id}`);
    } catch (error) {
      
      console.log(error);
      res.status(400).send('Something Went wrong');
    }
  });
  

  
  app.post('/hall/book', (req, res) => {
    let id = bookingDetails.length + 1;
    req.body.booked_hall_id = id;
    try {
      req.body.date = new Date(req.body.date);
      let booking_detail = {
        customerName: req.body.customerName,
        booked_hall_id: req.body.booked_hall_id,
        hall_name: req.body.hall_name,
        date: req.body.date,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        status: 'booked',
      };
      for (const book of bookingDetails) {
        if (
          book.date.getTime() == req.body.date.getTime() &&
          book.start_time === req.body.start_time
        ) {
          console.log(book.date.getTime(), req.body.date.getTime());
          console.log('in booking');
          return res
            .status(400)
            .send({ error: 'The hall is not available with this time slot' });
        } else {
          bookingDetails.push(booking_detail);
          return res
            .status(201)
            .send(
              `hall is successfully booked with the id ${req.body.booked_hall_id}`
            );
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send('Something Went wrong');
    }
  });
  
 
  
  app.get('/hall/booked-details', (req, res) => {
    let hallArray = [];
  
    bookingDetails.forEach((customer) => {
      let hallBook = {};
  
      hallBook.hall_name = customer.hall_name;
      hallBook.status = customer.status;
      hallBook.customerName = customer.customerName;
      hallBook.date = customer.date;
      hallBook.start_time = customer.start_time;
      hallBook.end_time = customer.end_time;
      hallArray.push(hallBook);
    });
    if(hallArray)
    res.status(200).send(hallArray);
    else
    res.status(400).send("NO Hall Details Available");
  });
  

  
  app.get('/hall/customer-details', (req, res) => {
    let customerArray = [];
  
    bookingDetails.forEach((customer) => {
      let customerhall= {};
   customerhall.customerName = customer.customerName;
   customerhall.hall_name = customer.hall_name;
   customerhall.date = customer.date;
   customerhall.start_time = customer.start_time;
   customerhall.end_time = customer.end_time;
      customerArray.push(customerhall);
    });
  if(customerArray)
    res.status(200).send(customerArray);
    else
    res.status(400).send("NO Customer Details Available");

  });

app.listen(process.env.PORT || 3000);