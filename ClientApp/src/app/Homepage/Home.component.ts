import { Component, Inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import swal from "sweetalert2";
import { Observable, throwError } from "rxjs";

@Component({
  selector: "app-my-items",
  templateUrl: "./Home.component.html",
})

//I have no idea how to do subrouting for each campaign id.
export class HomeComponent {
  /*
  variable definitions

  forecasts   - the list of all campaigns
  campaign    - the campaign you select to play
  
  */
  public forecasts: Campaigns[];
  public campaign: Campaigns = null;
  public cities: City[];
  public City: City = null;
  public shops: Shop[];
  public Shop: Shop = null;
  public items: Item[];


  /*----------------------------------------------------------
  
  
  Campaign selection menu
  
  
  ----------------------------------------------------------*/

  /*---------------------------


  Adding a Campaign
  
  
  ---------------------------*/
  setCampaign = async (Campaign) => {
    //so I guess this works now?
    await this.http
      .get<Campaigns>(
        this.baseUrl + `api/CampaignsController/${Campaign.id}/byID`
      )
      .subscribe(
        async(result) => {
          this.campaign = result;
          await this.getAllcities();

        },
        (error) => console.error(error)
      );
  };
  /*
  When the new campaign button is clicked. this function will pop up a sweetalert
  */
  postCampaignSwal() {
    swal.fire({
      title: "New Campaign",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need a title!";
        } else {
          this.postCampaign(value);
        }
      },
    });
  }
  //when the sweetalert is completed, this will send the data to the server
  postCampaign(value: string): Observable<Campaigns> {
    //sebd an http post
    this.http
      .post<Campaigns>(this.baseUrl + "api/CampaignsController", {
        Name: value,
      })
      //determine if there was an error.
      .subscribe(
        (result) => {
          //if no error, do a get after posting
          this.http
            .get<Campaigns[]>(this.baseUrl + "api/CampaignsController")
            .subscribe(
              (result) => {
                this.forecasts = result;
              },
              (error) => console.error(error)
            );
          return result;
        },

        //if there is an error. console error the response
        (error) => {
          console.error(error);
          return error;
        }
      );
    return;
  }

  /*---------------------------
  
  
  Deleting a Campaign
  
  
  ---------------------------*/

  //sweetalert for confirm
  deleteCampaignSwal(id) {
    swal
      .fire({
        title: "Do you want to delete?",
        showDenyButton: true,
        confirmButtonText: `Delete`,
        denyButtonText: `Don't Delete`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.DeleteCampaign(id);
        }
      });
  }

  //server request for delete
  DeleteCampaign(id: string) {
    this.http
      .delete<Campaigns>(this.baseUrl + `api/CampaignsController?id=${id}`)
      .subscribe(
        //do a get on a successful delete
        (result) => {
          this.http
            .get<Campaigns[]>(this.baseUrl + "api/CampaignsController")
            .subscribe(
              (result) => {
                this.forecasts = result;
              },
              (error) => console.error(error)
            );
          return result;
        },
        (error) => {
          console.error(error);
          return error;
        }
      );
    return;
  }

  /* -----------------------------
  

  Editing the campaign Name

  
  ------------------------------  */

  //sweetalert to type the new campaign name
  editCampaignSwal(id) {
    swal.fire({
      title: "New Campaign",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        } else {
          this.editCampaign(value, id);
        }
      },
    });
  }

  editCampaign(value: string, id: string) {
    this.http
      .put<Campaigns>(this.baseUrl + `api/CampaignsController?id=${id}`, {
        id: id,
        name: value,
      })
      .subscribe(
        (result) => {
          //do a get if successful
          this.http
            .get<Campaigns[]>(this.baseUrl + "api/CampaignsController")
            .subscribe(
              (result) => {
                this.forecasts = result;
              },
              (error) => console.error(error)
            );
          return result;
        },
        (error) => {
          console.error(error);
          return error;
        }
      );
    return;
  }


  getAllcities = async () => {
    //so I guess this works now?
    await this.http
      .get<City[]>(
        this.baseUrl + `api/CityController/${this.campaign.id}`
      )
      .subscribe(
        (result) => {
          this.cities = result;
          console.log(this.cities);
        },
        (error) => console.error(error)
      );
  };

  setCity = async (City) => {
    //so I guess this works now?
    await this.http
      .get<City[]>(
        this.baseUrl + `api/CampaignsController/${City.id}/getByID`
      )
      .subscribe(
        (result) => {
          this.cities = result;
        },
        (error) => console.error(error)
      );
  };
  AddCitySwal = async () => {
    swal.fire({
    title: "New City",
    input: "text",
    showCancelButton: true,
    inputValidator: (title) => {
      if (!title) {
        return "You need to write something!";
      } else {
        this.AddCity(title);
      }
    },
  });
  };
  AddCity(title) {
    let city = {
      Name: title, 
      CampaignsId: this.campaign.id
    };
    console.log(city);
    this.http
      .post<City>(this.baseUrl + `api/CityController`, city)
      .subscribe(
        (result) => {
          console.log(result);
          this.getAllcities();
        },
        (error) => console.error(error)
      );
  }
  SelectCity(city) {
    this.City = city;
    this.getAllShops(city.id);
  }
  
  DeleteCitySwal = async (id) => {
    swal.fire({
      title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async(result) => {
    if (result.isConfirmed) {
      await this.DeleteCity(id);
      await swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  });
  };
  DeleteCity(id) {
    this.http
      .delete<City>(this.baseUrl + `api/CityController/${id}`, )
      .subscribe(
        (result) => {
          console.log(result);
          this.getAllcities();
        },
        (error) => console.error(error)
      );
  }
  
  getAllShops = async (city) => {
    //so I guess this works now?
    await this.http
      .get<Shop[]>(
        this.baseUrl + `api/ShopController/${city}`
      )
      .subscribe(
        (result) => {
          this.shops = result;
          console.log(this.cities);
        },
        (error) => console.error(error)
      );
  };
  setShop = async (Shop) => {
    //so I guess this works now?
    await this.http
      .get<Shop[]>(
        this.baseUrl + `api/CampaignsController/${Shop.id}/getByID`
      )
      .subscribe(
        (result) => {
          this.shops = result;
        },
        (error) => console.error(error)
      );
  };
  AddShopSwal = async () => {
    swal.fire({
    title: "New Shop",
    input: "text",
    showCancelButton: true,
    inputValidator: (title) => {
      if (!title) {
        return "You need to write something!";
      } else {
        swal.fire({
          title: "Capacity",
            input: "select",
            inputOptions:[50,75,100,125,150,200,300],
            showCancelButton: true,
            inputValidator: (value2) => {
              if (!value2) {
                return "You need to write something!";
              } else {
                this.AddShop(title);
              }
            },
          });
        }
      },
    });        
    return;
  };
  AddShop(title) {
    let city = {
      Name: title, 
      City: this.City.id
    };
    console.log(city);
    this.http
      .post<Shop>(this.baseUrl + `api/ShopController`, city)
      .subscribe(
        (result) => {
          console.log(result);
          this.getAllShops(this.City.id);
        },
        (error) => console.error(error)
      );
  }
  SelectShop(city) {
    this.Shop = city;
  }DeleteShopSwal = async (id) => {
    swal.fire({
      title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async(result) => {
    if (result.isConfirmed) {
      await this.DeleteShop(id);
      await swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  });
  };
  DeleteShop(id) {
    this.http
      .delete<Shop>(this.baseUrl + `api/ShopController/${id}`, )
      .subscribe(
        (result) => {
          console.log(result);
          this.getAllShops(this.City.id);
        },
        (error) => console.error(error)
      );
  }

  //End of Shop


  DeleteItemSwal = async (id) => {
    swal.fire({
      title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async(result) => {
    if (result.isConfirmed) {
      await this.DeleteItem(id);
      await swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  });
  };
  DeleteItem(id) {
    this.http
      .delete<Shop>(this.baseUrl + `api/ItemController/${id}`, )
      .subscribe(
        (result) => {
          console.log(result);
          this.getAllShops(this.City.id);
        },
        (error) => console.error(error)
      );
  }
  getAllItems = async (shop) => {
    //so I guess this works now?
    await this.http
      .get<Item[]>(
        this.baseUrl + `api/ItemController/${shop}`
      )
      .subscribe(
        (result) => {
          this.items = result;
          console.log(this.items);
        },
        (error) => console.error(error)
      );
  };
  
/*
  
  
  
  ______   ______   .__   __.      _______.___________..______       __    __    ______ .___________.  ______   .______      
 /      | /  __  \  |  \ |  |     /       |           ||   _  \     |  |  |  |  /      ||           | /  __  \  |   _  \     
|  ,----'|  |  |  | |   \|  |    |   (----`---|  |----`|  |_)  |    |  |  |  | |  ,----'`---|  |----`|  |  |  | |  |_)  |    
|  |     |  |  |  | |  . `  |     \   \       |  |     |      /     |  |  |  | |  |         |  |     |  |  |  | |      /     
|  `----.|  `--'  | |  |\   | .----)   |      |  |     |  |\  \----.|  `--'  | |  `----.    |  |     |  `--'  | |  |\  \----.
 \______| \______/  |__| \__| |_______/       |__|     | _| `._____| \______/   \______|    |__|      \______/  | _| `._____|
                                                                                                                             
|                                                                                                                             |
V                                                                                                                             V
  
  */
  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") public baseUrl: string
  ) {
    http.get<Campaigns[]>(baseUrl + "api/CampaignsController").subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => console.error(error)
    );
  }
}

/*------------------------------------------------




Defining Classes



----------------------------------------------------*/

interface Campaigns {
  id: string;
  name: string;
}
interface City {
  id: string;
  CampaignsId: string;
  Name: string;
}
interface Shop {
  id: string;
  CityId: string;
  Name: string;
  Capacity: Number;
  Items: Item[];
}
interface Item {
  id: string;
  rarity: string;
  cost: string;
}
