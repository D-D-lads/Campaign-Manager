import { Component, Inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import swal from "sweetalert2";
import { Observable, throwError } from "rxjs";
import { async } from "@angular/core/testing";

@Component({
  selector: "app-my-items",
  templateUrl: "./myItems.component.html",
})

//I have no idea how to do subrouting for each campaign id.
export class MyItemsComponent {
  public items: Item[];


AddItemSwal = async()=>{
  
  swal.fire({
    title: "New Item",
    text:"Item Name",
    input: "text",
    showCancelButton: true,
    inputValidator: (name) => {
      if (!name) {
        return "You need to write something!";
      } else {
        swal.fire({
          title: "Rarity",
            input: "select",
            inputOptions:["Common","Uncommon","Rare","Very Rare","Legendary"],
            showCancelButton: true,
            inputValidator: (rarity) => {
              if (!rarity) {
                return "You need to write something!";
              } else {
                swal.fire({
                title: "Cost",
                text:"(include unit)",
                  input: "text",
                  showCancelButton: true,
                  inputValidator: (cost) => {
                    if (!cost) {
                      return "You need to write something!";
                    } else {
                      this.AddItem({Name:name, Rarity:rarity, Cost:cost});
                    }
                  },
                });
              }
            },
          });
        }
      },
    });        
    return;
}
AddItem(item){
  this.http
    .post<Item>(this.baseUrl + `api/ItemsController`, item)
    .subscribe(
      (result) => {
        console.log(result);
        this.getAllItems();
      },
      (error) => console.error(error)
    );
}

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
      .delete<Item>(this.baseUrl + `api/ItemsController/${id}` )
      .subscribe(
        (result) => {
          console.log(result);
          this.getAllItems();
        },
        (error) => console.error(error)
      );
  }
  getAllItems = async () => {
    //so I guess this works now?
    await this.http
      .get<Item[]>(
        this.baseUrl + `api/ItemsController`
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
    http.get<Item[]>(baseUrl + "api/ItemsController").subscribe(
      (result) => {
        this.items = result;
      },
      (error) => console.error(error)
    );
  }
}

/*------------------------------------------------




Defining Classes



----------------------------------------------------*/
interface Item {
  id: string;
  rarity: string;
  cost: string;
}
