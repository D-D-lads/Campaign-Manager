import { Component, Inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import swal from "sweetalert2";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Component({
  selector: "app-my-campaigns",
  templateUrl: "./myCampaigns.component.html",
})

//I have no idea how to do subrouting for each campaign id.
export class MyCampaignsComponent {
  public forecasts: Campaigns[];
  public campaign: Campaigns = null;
  //When the new campaign button is clicked. this function will pop up a sweetalert
  onClickMe() {
    swal.fire({
      title: "New Campaign",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        } else {
          this.postData(value);
        }
      },
    });
  }
  //when the sweetalert is completed, this will send the data to the server
  postData(value: string): Observable<Campaigns> {
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

  //this should pop up with a sweetalert asking if you're sure.
  deleteCampaign(id) {
    swal
      .fire({
        title: "Do you want to delete?",
        showDenyButton: true,
        confirmButtonText: `Delete`,
        denyButtonText: `Don't Delete`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.deleteData(id);
        }
      });
  }

  //on swal confirm, delete the campaign from the database
  deleteData(id: string) {
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
  //edit the campaign's name.
  editCampaign(id) {
    swal.fire({
      title: "New Campaign",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        } else {
          this.editData(value, id);
        }
      },
    });
  }

  //post the edit to the db, then do a get on success
  editData(value: string, id: string) {
    this.http
      .put<Campaigns>(this.baseUrl + `api/CampaignsController?id=${id}`, {
        id: id,
        name: value,
      })
      .subscribe(
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

  // set the campaign variable to the campaign that is clicked on
  setCampaign(Campaign) {
    this.http
      .get<Campaigns>(this.baseUrl + `api/CampaignsController`, Campaign.id)
      .subscribe(
        (result) => {
          console.log(result);
        },
        (error) => console.error(error)
      );
  }

  // add a plotline to the currently selected campaign
  addPlotLine = (Campaign) => {
    swal.fire({
      title: "New Campaign",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        } else {
        }
      },
    });
    return;
  };
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

interface Campaigns {
  name: string;
}
