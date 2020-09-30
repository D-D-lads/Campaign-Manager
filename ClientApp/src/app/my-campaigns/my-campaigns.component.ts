import { Component, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-my-campaigns",
  templateUrl: "./my-campaigns.component.html",
})
export class MyCampaignsComponent {
  public forecasts: Campaigns[];

  constructor(http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    http.get<Campaigns[]>(baseUrl + "").subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => console.error(error)
    );
  }
}

interface Campaigns {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
