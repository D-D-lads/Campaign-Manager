import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { MyItemsComponent } from "./home/myItems.component";
import { FetchDataComponent } from "./fetch-data/fetch-data.component";
import { MyCampaignsComponent } from "./myCampaigns/myCampaigns.component";
import { MyShopsComponent } from "./myShops/myShops.component";
import { HomeComponent } from "./Homepage/Home.component";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    MyItemsComponent,
    FetchDataComponent,
    MyCampaignsComponent,
    MyShopsComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "myItems", component: MyItemsComponent, pathMatch: "full" },
      { path: "myShops", component: MyShopsComponent },
      { path: "myCampaigns", component: MyCampaignsComponent },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
