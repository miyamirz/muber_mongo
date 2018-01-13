const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

const Driver = mongoose.model('driver');
// beforeEach((done) => {
//   mongoose.connection.collections.drivers.drop();
//   done();
// });

describe('Driver Controller',() => {

    it('Post to /api/drivers creates a new driver', (done) => {

      Driver.count()
            .then(count => {
              //console.log(count);
              request(app)
                 .post('/api/drivers')
                 .send({'email':'test@test.com'})
                 .end(() =>{
                   Driver.count().then(newCount => {
                    // console.log(count,newCount);
                     assert(count+1 === newCount);
                     done();
                   });

            });

         });
    });


  it('PUT to /api/drivers/:id edits an existing driver',(done) => {
    const driver = new Driver({'email':'miyamirza.esc@gmail.com','driving':false});
    driver.save().then(()=>{

          request(app)
            .put(`/api/drivers/${driver._id}`)
            .send({driving:true})
            .end(() => {
              Driver.findOne({email:'miyamirza.esc@gmail.com'})
                    .then((driver) => {
                        //console.log("after:"+driver);
                        assert(driver.driving === true);
                        done();
                    });
            });
    });
  });

  it('DELETE to /api/drives/:id can delete a driver',done=>{
    const driver = new Driver({email:'test@test.com'});
    driver.save().then(() => {
      request(app)
         .delete(`/api/drivers/${driver._id}`)
         .end(() => {
           Driver.findOne({email:'test@test.com'})
                .then((driver) => {
                  assert(driver === null);
                  done();
                });
         });
    });
  });

  it('GET to /api/drivers finds drivers in a location ',done => {
    const seattleDriver = new Driver({email:'seattle@test.com',
                                      geometry:{type:'Point',coordinates:[-122.47595022,47.6147628]}
                                    });

  const miamiDriver = new Driver({email:'miami@test.com',
    geometry:{type:'Point',coordinates:[-80.253,25.719]}
      });

 Promise.all([seattleDriver.save() , miamiDriver.save()])
        .then(() => {
          request(app)
            .get('/api/drivers?lng=-80&lat=25')
            .end((err,response) => {
         //console.log(response;
           assert(response.body.length === 1);
         assert(response.body[0].obj.email === 'miami@test.com');
            done();
        });
});
  });
});
