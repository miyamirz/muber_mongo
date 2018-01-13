const Driver = require('../models/driver');

module.exports = {

    greeting(req,res) {

       res.send({hi:'there'});
    },

    index(req,res,next){
    //  console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%index%%%%%%%%%%%%%%%%%%%%%");
      const {lng,lat} = req.query;

       Driver.geoNear(
               {type:'Point',coordinates:[parseFloat(lng),parseFloat(lat)]},
               {spherical:true,maxDistance:200000})
             .then(drivers => res.send(drivers))
             .catch(next);

    },

    create(req,res,next){
      console.log("Creating");
        const driverProps = req.body;
        Driver.create(driverProps)
              .then(driver => {
                //console.log(driver);
                res.send(driver)
              })
            .catch(next);

    },

   edit(req,res,next){
     console.log("Edit here")
     const DriverId = req.params.id;
     const driverProps = req.body;
    // console.log(driverProps);

     Driver.findByIdAndUpdate({_id:DriverId},driverProps)
           .then(() => Driver.findById({_id : DriverId}))
           .then((driver) => {

          //  console.log(driver);
             res.send(driver)})
           .catch(next);
         },

  delete(req,res,next){
    const DriverId = req.params.id;
    Driver.findByIdAndRemove({_id:DriverId})
          .then((driver) => res.status(204).send(driver))
          .catch(next);
  }
};
