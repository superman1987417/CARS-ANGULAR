import { Component , Renderer2, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';
import { ConfigurationService } from '../../shared/services/configs/configs.service';
import { HttpClient } from '@angular/common/http';

import * as $ from 'jquery';
//import 'owlcarousel';

@Component({
  selector: '',
  templateUrl: 'home.component.html',
  styleUrls:['./home.component.css'], 
  providers:[ConfigurationService]  
})
export class HomeComponent implements OnInit {
  title = 'app';
  carsResults = [];
  isSearchData = false ;
  allmakes:any = [];
  apiImageUrl = this.config.getAPIUrl() + 'uploads/';
  constructor(private renderer : Renderer2, private http: HttpClient, private config: ConfigurationService){
    this.renderer.addClass(document.body, 'absolute-nav');
  }

  ngOnInit(){
    let self = this;
    self.http.get(self.config.getAPIUrl()+ "car/makes").subscribe(makes=>{
        self.allmakes = makes;
        console.log("data : " + JSON.stringify(makes));
    },error=>{
        console.log(error, "error occured");
    })
  }

  ngAfterViewInit(){
    //$(".b-slider").owlCarousel();
  }
  onSearchChange(val){
    let self = this;
    if(val == ''){
      self.isSearchData = false ;
    }
    else{
      let qry = encodeURI(val);      
      self.http.get(self.config.getAPIUrl()+'car/search/'+qry).subscribe(cars =>{
          console.log(cars ,"cars");
          self.isSearchData = true ;
          self.carsResults = cars['data'];
      }, error=>{ 
          console.log(error, "Error in car search");
      });
    }   
  }

  ngOnDestroy(){
    this.renderer.removeClass(document.body, 'absolute-nav');
  }
}
