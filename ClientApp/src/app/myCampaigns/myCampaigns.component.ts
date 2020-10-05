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
  /*
  variable definitions

  forecasts   - the list of all campaigns
  campaign    - the campaign you select to play
  characters  - the list of all characters in the selected campaign
  plotlines   - the list of all plotlines in the selected campaign
  statuses    - the list of all statuses in the selected campaign
  filter      - an array of all characters or plotlines to include in your search
  
  */
  public forecasts: Campaigns[];
  public campaign: Campaigns = null;
  public characters: Character[];
  public plotlines: Plotline[];
  statuses: string[];
  filter: Object[];

  /*----------------------------------------------------------
  
  
  Campaign selection menu
  
  
  ----------------------------------------------------------*/

  /*---------------------------


  Adding a Campaign
  
  
  ---------------------------*/

  /*
  When the new campaign button is clicked. this function will pop up a sweetalert
  */
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

  /*---------------------------
  
  
  Deleting a Campaign
  
  
  ---------------------------*/

  //sweetalert for confirm
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

  //server request for delete
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

  /* -----------------------------
  

  Editing the campaign Name

  
  ------------------------------  */

  //sweetalert to type the new campaign name
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

  //edit the campaign on the server
  editData(value: string, id: string) {
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

  /*--------------------------------------------------



  
Campaign Selection




---------------------------------------------------*/

  /*-------------------


Select Campaign


--------------------*/

  // set the campaign variable to the campaign that is clicked on
  setCampaign = async (Campaign) => {
    //so I guess this works now?
    await this.http
      .get<Campaigns>(
        this.baseUrl + `api/CampaignsController/${Campaign.id}/byID`
      )
      .subscribe(
        (result) => {
          this.campaign = result;
        },
        (error) => console.error(error)
      );
    await this.getCharacters(Campaign);
  };

  /* --------------------------------------
  
  
  Getting characters in selected campaign


  
  -------------------------------------- */
  getCharacters(campaign) {
    this.http
      .get<Character[]>(this.baseUrl + `api/CharacterController/${campaign.id}`)
      .subscribe(
        (result) => {
          this.characters = result;
          console.log(result);
        },
        (error) => console.error(error)
      );
  }

  /* -------------
  
  

 __    _  _______  _______                 ______   _______  __    _  _______ 
|  |  | ||       ||       |               |      | |       ||  |  | ||       |
|   |_| ||   _   ||_     _|               |  _    ||   _   ||   |_| ||    ___|
|       ||  | |  |  |   |                 | | |   ||  | |  ||       ||   |___ 
|  _    ||  |_|  |  |   |                 | |_|   ||  |_|  ||  _    ||    ___|
| | |   ||       |  |   |                 |       ||       || | |   ||   |___ 
|_|  |__||_______|  |___|                 |______| |_______||_|  |__||_______|


  
  Adding a character to your campaign
  
  
  
  --------------- */

  addCharacter(character, campaign) {
    this.http
      .get<Character[]>(this.baseUrl + `api/CharacterController/${campaign.id}`)
      .subscribe(
        (result) => {
          this.characters = result;
          console.log(result);
        },
        (error) => console.error(error)
      );
  }

  /* -------------
  
  

 __    _  _______  _______                 ______   _______  __    _  _______ 
|  |  | ||       ||       |               |      | |       ||  |  | ||       |
|   |_| ||   _   ||_     _|               |  _    ||   _   ||   |_| ||    ___|
|       ||  | |  |  |   |                 | | |   ||  | |  ||       ||   |___ 
|  _    ||  |_|  |  |   |                 | |_|   ||  |_|  ||  _    ||    ___|
| | |   ||       |  |   |                 |       ||       || | |   ||   |___ 
|_|  |__||_______|  |___|                 |______| |_______||_|  |__||_______|


  
  Adding a Plotline to your campaign
  
  
  
  --------------- */
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
interface Character {
  id: string;
  CampaignsId: string;
  name: string;
}
interface Plotline {
  id: string;
  CampaignsId: string;
  name: string;
}
