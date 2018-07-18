import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';

import { Item } from '../models/item';
import { Observable } from '../../../node_modules/rxjs';
import { map } from '../../../node_modules/rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  itemDoc: AngularFirestoreDocument<Item>;

  constructor(public afs: AngularFirestore) { 
    this.itemsCollection = this.afs.collection('items', ref => ref.orderBy('title', 'asc'));
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(changes => 
        changes.map(a => {
          const data = a.payload.doc.data() as Item;
          const id = a.payload.doc.id;
          return {id,...data};
      })));
  }

  getItems(){
    return this.items;
  }

  addItem(item: Item){
    this.itemsCollection.add(item);
  }

  deleteItem(item: Item){
    this.itemDoc = this.afs.doc('items/' + item.id);
    this.itemDoc.delete();
  }

  updateItem(item: Item){
    this.itemDoc = this.afs.doc('items/' + item.id);
    this.itemDoc.update(item);
  }
}


