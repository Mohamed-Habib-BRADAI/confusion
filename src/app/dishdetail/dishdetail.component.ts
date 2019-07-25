import { Component, OnInit , ViewChild, Inject} from '@angular/core';
import {Dish} from '../shared/dish'
import { DishService} from '../services/dish.service';
import { Params,ActivatedRoute} from '@angular/router';
import { Location}from '@angular/common'
import { switchMap } from 'rxjs/operators';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { baseURL } from '../shared/baseurl'
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';
import {visibility, flyInOut,expand} from '../animations/app.animation'
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host:{
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations:[
    visibility()
, flyInOut(),expand()
  ]
    
})

export class DishdetailComponent implements OnInit {
  @ViewChild('fform') commentFormDirective;
  errMess: string ;
comment={
  'author': '',
  'rating': 5,
  'date' : '',
  'comment': '',
};
 
  dishcopy : Dish;
  dish : Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  visibility = 'shown';
  formErrors = {
    'author': '',
    'comment': '',
    
  };
validationMessages = {
  'author':{
    'required':    ' Author name is required. ',
    'minlength':   ' Author name must be at least 2 characters long.'
  },
  comment:{
    'required':    'Comment is required.'
  }
}
  constructor(private dishService: DishService,
  private location: Location,
private route: ActivatedRoute,
private fb: FormBuilder,
private processHTTPMsgService: ProcessHTTPMsgService,
@Inject('BaseURL') private BaseURL) {
  this.createForm();
 }
  
  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds= dishIds,errMess => this.errMess= <any> errMess )
    this.route.params.pipe(switchMap((params: Params)=> {this.visibility='hidden';return this.dishService.getDish(params['id']);})).subscribe(
      dish => {this.dishcopy=dish ;this.dish=dish;this.setPrevNext(dish.id);this.visibility = 'shown'; }, errMess => this.errMess=<any>errMess
    )
  
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack(): void {
    this.location.back();
  }
  createForm(){
    this.commentForm= this.fb.group({
      author:['',[Validators.required,Validators.minLength(2)]],
      rating:5,
      comment:['',Validators.required]
    })
    this.commentForm.valueChanges.subscribe(data => this.onValueChanges(data))
    this.onValueChanges();
  }
  onValueChanges(data?:any){
if(!this.commentForm){return;}
const form = this.commentForm;
for (const field in this.formErrors) {
  if (this.formErrors.hasOwnProperty(field)) {
    // clear previous error message (if any)
    this.formErrors[field] = '';
    const control = form.get(field);
    if (control && control.dirty && !control.valid) {
      const messages = this.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
  }
  onSubmit(){
this.comment=this.commentForm.value;
this.comment.date=new Date().toISOString();
this.dishcopy.comments.push(this.comment);
this.dishService.putDish(this.dishcopy).subscribe(
 dish=>{
   this.dish =dish;
   this.dishcopy = dish
 } , errMess=> {this.dish = null ; this.dishcopy = null ;this.errMess =<any> errMess}
)
this.commentForm.reset({
  author:'',
  rating:5,
  comment:''
})
this.commentFormDirective.resetForm();
  }
}
