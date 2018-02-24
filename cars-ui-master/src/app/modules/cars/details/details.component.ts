import { Component , Renderer2, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationService } from '../../../shared/services/configs/configs.service';
import { HelperService } from '../../../shared/services/helper/helper.service';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as $ from 'jquery';
import * as toastr from 'toastr';
import 'block-ui';

@Component({
  selector: '',
  templateUrl: 'details.component.html',
  providers: [ConfigurationService]  
})
export class CarsDetailsComponent implements OnDestroy {

  modalRef: BsModalRef;
  title = 'app';
  carDetails:any = {};
  relatedModels:any = [];
  apiImageUrl = this.config.getAPIUrl() + 'uploads/';
  newEnquiry:any = {};
  currentModelId: any = false;
  showSuccess:any = false;
  selectedListingId:any = false;
  constructor(private renderer : Renderer2, private route: ActivatedRoute, private router: Router, private http : HttpClient, private config : ConfigurationService, private modalService: BsModalService, private helper : HelperService){
    this.renderer.addClass(document.body, 'm-detail');
    this.helper.showLoader();
  }
  
  openModal(template: TemplateRef<any>, listingId) {
    let self = this;
    self.selectedListingId =listingId;
    self.newEnquiry = {};
    this.modalRef = this.modalService.show(template);
  }

  doEnquiry(data){
    let self = this ;
    let newEnquiryData  = {
      listing_id : self.selectedListingId,
      first_name : data.value.firstname,
      last_name : data.value.lastname,
      email : data.value.email,
      phone : data.value.phone,
      messsage : data.value.messsage
    }
    self.helper.showLoader();
    self.http.post(self.config.getAPIUrl()+ 'enquiry/new', newEnquiryData).subscribe(enquiry_data=>{      
      self.helper.showMessage("success", "Enquiry have been submitted successfully. Dealer will get back to you soon .");
      self.helper.hideLoader();
    },
    error=>{
      self.helper.showMessage("error", "Error in submitting enquiry!!");
      self.helper.hideLoader();
    }) 
  }

  ngOnInit(){
    
    let self = this ;
    this.route
      .queryParams
      .subscribe(params => {
        self.http.get(self.config.getAPIUrl()+ 'enquiry/list').subscribe(enquiries=>{
          console.log(enquiries, "enquiries");
        });
        
        self.http.get(self.config.getAPIUrl()+ 'car/model/details/'+params.model ).subscribe(details=>{
          self.carDetails = details;
          self.helper.hideLoader();
          self.http.get(self.config.getAPIUrl()+ 'car/model/related/'+params.model ).subscribe(related_models=>{
            self.relatedModels = related_models;                
          }, 
          error=>{
            //console.log("error occured while getting listing");
          })               
        }, 
        error=>{
          //console.log("error occured while getting listing");
        })
        
    });
  }

  ngOnDestroy(){
    this.renderer.removeClass(document.body, 'm-detail');
  }
}

