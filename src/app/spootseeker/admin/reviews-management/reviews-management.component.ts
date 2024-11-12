import { Component } from '@angular/core';
import { Comments } from '../../classes/comments';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-reviews-management',
  templateUrl: './reviews-management.component.html',
  styleUrl: './reviews-management.component.css'
})
export class ReviewsManagementComponent {
  comenlist:Comments[]=[];
  comentogj: Comments = {
    id_comment: '',
    id_destination: '',
    email_adhrent: '',
    rates: 0,
    title_comment: '',
    content: '',
    id_event: ''
  }
constructor(private commentsservice:CommentsService){}
  // to get all the comments
  getcomments() {
    this.commentsservice.getcomment().subscribe(
      (res: any) => {
        this.comenlist = res.map((e: any) => {
          const data = e.payload.doc.data();
          return {
            id_comment: e.payload.doc.id,
            id_destination: data.id_destination,
            email_adhrent: data.email_adhrent,
            rates: data.rates,
            title_comment: data.title_comment,
            content: data.content,

          };
        });
      },
      err => {
        
        console.error('Error fetching events:', err);
      }
    );
  }

  // to delete the comment
  deletecomment(comment:Comments){
    if(window.confirm('are you sure that you want to delete this comment? '))
    this.commentsservice.deletecomment(comment);
  }

  ngOnInit(): void {
    this.getcomments();
  }
}
