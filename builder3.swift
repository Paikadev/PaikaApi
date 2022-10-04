//
//  BuilderView.swift
//  test_UI
//
//  Created by Eduardo Valadez on 03/06/22.
//


import SwiftUI

struct BuilderView: View {
    
    @State var loading = false
    
    @State var turnIndex:Int = 0
    
    @State var name: String = ""
    @State var description: String = ""
    @State var hashtag: String = ""
    @State var res: String = ""
    @State var res1: String = ""
    @State var res2: String = ""
    @State var res4: String = ""
    @State var textDisplay: String = ""
    @State var e: String = ""
    
    @State var timeLineList: [String] = []
    @State var totalTimeLine: Int = 0
    
    @State var randomPlayers = false
    @State var roundPlayers = true
    
    
    @State var Player1 = true
    @State var Player2 = false
    @State var Player3 = false
    @State var Player4 = false
    
    @State var prompt1 = false
    @State var prompt2 = false
    @State var prompt3 = false
    
    @State var promptSelected: String = ""
    
    @State var isActive = false
    @State var roomName = ""
    
    let itemsSec = ["15","30","45", "60"]
    @State private var selection: String = "15"
    
    @State var playerNumber:Int = 0
    @State var optionCorrect:String = ""
    
    
    @State var checked = false
    @State var checked1 = false
    @State var checked2 = false
    @State var checked3 = false
    
    @State var textOnlyArray: [TextOnlyModel] = []
    @State var votesArray: [PostVotesModel] = []
    @State var MultipleOptionsArray: [MultipleOptionsModel] = []
    
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        NavigationView{
           
            ScrollView(.vertical, showsIndicators: false){
                if self.loading {
                    LoadingView()
                } else{
                    HStack{
                        Image("BuildImg_PH")
                            .resizable()
                            .frame(width: 100, height: 100)
                            .padding()
                            
                        VStack(alignment: .leading){
                            Text("Name")
                                .font(.system(size: 13))
                            
                            TextField("", text: $name)
                                .background(
                                    RoundedRectangle(cornerRadius: 2)
                                        .stroke(Color("PaikaBlack"),lineWidth: 1.5))
                                .frame(height: 15)
                                
                            Text("Description")
                                .font(.system(size: 13))
                            TextField("", text: $description)
                                .background(
                                    RoundedRectangle(cornerRadius: 2)
                                        .stroke(Color("PaikaBlack"),lineWidth: 1.5))
                                .frame(height: 15)
                            
                            
                            
                        }
                        .padding()
                        
                    }
                    
                    VStack{
                        HStack{
                            Text("Hashtags")
                                .font(.system(size: 13))
                                
                            Spacer()
                        }
                        .background(
                            RoundedRectangle(cornerRadius: 2)
                                .stroke(Color("PaikaBlack"),lineWidth: 1.5))
                        .frame(height: 15)
                        TextField("", text: $hashtag)
                            .background(
                                RoundedRectangle(cornerRadius: 2)
                                    .stroke(Color("PaikaBlack"),lineWidth: 1.5))
                            .frame(height: 15)
                       
                        Text("Settings")
                            .font(Font.system(size: 20, weight: .regular))
                            .foregroundColor(Color.black)
                        HStack{
                            Text("Players (Max)")
                                .font(.system(size: 13))
                            Spacer()
                        }
                        HStack{
                            Group{
                                Toggle("",isOn: $Player1)
                                    .onChange(of: Player1) { value in
                                        if value {
                                            self.playerNumber = 1
                                            self.Player2 = false
                                            self.Player3 = false
                                            self.Player4 = false
                                        }
                                                }
                                .toggleStyle(CustomPlayerToggle(number: 1))
                                Spacer()
                                Toggle(isOn: $Player2, label: {
                                }).onChange(of: Player2) { value in
                                    if value {
                                        self.playerNumber = 2
                                        self.Player1 = false
                                        self.Player3 = false
                                        self.Player4 = false
                                    }
                                            }
                                .toggleStyle(CustomPlayerToggle(number: 2))
                                Spacer()
                                Toggle(isOn: $Player3, label: {
                                })
                                    .onChange(of: Player3) { value in
                                        if value {
                                            self.playerNumber = 3
                                            self.Player2 = false
                                            self.Player1 = false
                                            self.Player4 = false
                                        }
                                                }
                                .toggleStyle(CustomPlayerToggle(number: 3))
                                Spacer()
                                Toggle(isOn: $Player4, label: {
                                })
                                    .onChange(of: Player4) { value in
                                        if value {
                                            self.playerNumber = 4
                                            self.Player2 = false
                                            self.Player3 = false
                                            self.Player1 = false
                                        }
                                                }
                                .toggleStyle(CustomPlayerToggle(number: 4))
                            }
                        }.padding()
                        HStack{
                            Toggle(isOn: $randomPlayers, label: {                            Text("Random player selection")
                                    .font(.system(size: 13))
                            })
                                .toggleStyle(SwitchToggleStyle(tint: Color("PaikaPrimaryColor")))
                        }
                        HStack{
                            
                            Toggle(isOn: $roundPlayers, label: {     Text("Draft more than 1 player per round")
                                    .font(.system(size: 13))
                            })
                            .toggleStyle(SwitchToggleStyle(tint: Color("PaikaPrimaryColor")))
                        }
                        
                        VStack{
                            Rectangle()
                                .fill(.gray.opacity(0.4))
                                .frame( height: 2)
                            Text("Add prompts")
                                .font(Font.system(size: 20, weight:.regular))
                                .foregroundColor(Color.black)
                        }
                        .padding()
                        
                        HStack{
                            Text("Text to display")
                                .font(.system(size: 13))
                            Spacer()
                                .font(.system(size: 13))
                        }
                        HStack{
                            VStack(alignment: .leading){
                                TextField("", text: $textDisplay)
                                    .frame(height: 55)
                                       .textFieldStyle(PlainTextFieldStyle())
                                       .padding([.horizontal], 4)
                                    .background(
                                        RoundedRectangle(cornerRadius: 2)
                                            .stroke(Color("PaikaBlack"),lineWidth: 1.5))
                                
                                prompt3 ? VStack{
                                    HStack{
                                        TextField("", text: $res)
                                            .background(
                                                RoundedRectangle(cornerRadius: 2)
                                                    .stroke(Color("PaikaBlack"),lineWidth: 1.5))
                                            .frame(height: 15)
                                        Toggle(isOn: $checked, label: {})
                                            .onChange(of: checked) { value in
                                                if value {
                                                    self.optionCorrect = self.res
                                                    self.checked2 = false
                                                    self.checked3 = false
                                                    self.checked1 = false
                                                }
                                            }
                                        .toggleStyle(CustomCheckToggle())
                                        
                                    }
                                    .padding()
                                    HStack{
                                        TextField("", text: $res1)
                                            .background(
                                                RoundedRectangle(cornerRadius: 2)
                                                    .stroke(Color("PaikaBlack"),lineWidth: 1.5))
                                            .frame(height: 15)
                                        Toggle(isOn: $checked1, label: {})
                                            .onChange(of: checked1) { value in
                                                if value {
                                                    self.optionCorrect = self.res1
                                                    self.checked2 = false
                                                    self.checked3 = false
                                                    self.checked = false
                                                }
                                            }
                                        .toggleStyle(CustomCheckToggle())
                                        
                                    }.padding()
                                    HStack{
                                        TextField("", text: $res2)
                                            .background(
                                                RoundedRectangle(cornerRadius: 2)
                                                    .stroke(Color("PaikaBlack"),lineWidth: 1.5))
                                            .frame(height: 15)
                                        Toggle(isOn: $checked2, label: {})
                                            .onChange(of: checked2) { value in
                                                if value {
                                                    self.optionCorrect = self.res2
                                                    self.checked = false
                                                    self.checked3 = false
                                                    self.checked1 = false
                                                }
                                            }
                                        .toggleStyle(CustomCheckToggle())
                                        
                                    }.padding()
                                    HStack{
                                        TextField("", text: $res4)
                                            .background(
                                                RoundedRectangle(cornerRadius: 2)
                                                    .stroke(Color("PaikaBlack"),lineWidth: 1.5))
                                            .frame(height: 15)
                                        Toggle(isOn: $checked3, label: {})
                                            .onChange(of: checked3) { value in
                                                if value {
                                                    self.optionCorrect = self.res4
                                                    self.checked2 = false
                                                    self.checked = false
                                                    self.checked1 = false
                                                }
                                            }
                                        .toggleStyle(CustomCheckToggle())
                                        
                                    }
                                    .padding()
                                } : nil
                                
                                HStack{
                                    Toggle("",isOn: $prompt1)
                                        .onChange(of: prompt1) { value in
                                            if value {
                                                self.promptSelected = "Chat Votes"
                                                
                                                prompt2 = false
                                                prompt3 = false
                                            }
                                                    }
                                        .toggleStyle(CustomPromptToggle(text: "Chat votes", image: "Builder_chat_"))
                                    Spacer()
                                    Toggle("",isOn: $prompt2)
                                        .onChange(of: prompt2) { value in
                                            if value {
                                                self.promptSelected = "Text Only"
                                                
                                                prompt1 = false
                                                prompt3 = false
                                            }
                                                    }
                                        .toggleStyle(CustomPromptToggle(text: "Text Only", image: "Builder_Text_"))
                                    Spacer()
                                    Toggle("",isOn: $prompt3)
                                        .onChange(of: prompt3) { value in
                                            if value {
                                                self.promptSelected = "Multiple Options"
                                                
                                                prompt1 = false
                                                prompt2 = false
                                            }
                                                    }
                                        .toggleStyle(CustomPromptToggle(text: "Multiple Options", image:"Builder_Multiple_"))
                                }.padding()
                                
                                
                            }
                            VStack{
                                Image("BuildImg_PH")
                                    .resizable()
                                    .frame(width: 35, height: 35)
                                Image("BuildMusic_PH")
                                    .resizable()
                                    .frame(width: 35, height: 35)
                                Menu{
                                    Picker("",selection: $selection){
                                        ForEach(itemsSec,id:\.self){
                                            Text("\($0)" + " sec")
                                                .foregroundColor(Color("PaikaSeccondColor"))
                                                .font(.system(size: 13))
                                        }
                                    }
                                    .accentColor(.black)
                                } label: {
                                    VStack{
                                        Image("Builder_Timer")
                                            .resizable()
                                            .frame(width: 35, height: 35)
                                        Text(selection + " sec")
                                            .foregroundColor(Color.black)
                                            .font(.system(size: 12))
                                    }
                                }
                                    Spacer()
                            }
                            
                        }
                        
                        
                    }
                    .padding()
                    
                    
                    //
                    VStack{
                        Button(action: {
                           
                            //Add click event
                            var selectionTime: Int = Int(selection) ?? 15
                            
                            switch promptSelected {
                            case "Chat Votes":
                                votesArray.append(PostVotesModel(idInteraction: 0, turn: self.turnIndex, player1_points: 0, player2_points: 0, player3_points: 0, player4_points: 0, total: 0, text: self.textDisplay, img: "test", time: Int(self.selection) ?? 15))
                                turnIndex+=1;
                            case "Text Only":
                                self.textOnlyArray.append(TextOnlyModel(idInteraction: 0, turn: self.turnIndex, text: self.textDisplay, img: "IMG", time: Int(self.selection) ?? 15))
                                turnIndex+=1;
                            case "Multiple Options":
                                self.MultipleOptionsArray.append(MultipleOptionsModel(idInteraction: 0, turn: self.turnIndex, option_1: res, option_2: res1, option_3: res2, option_4: res4, option_correct: self.optionCorrect, text: self.textDisplay, img: "ksk", time: Int(self.selection) ?? 15))
                                turnIndex+=1;
                            default:
                                print("err")
                            }
                            
                            if promptSelected != ""
                            {
                                timeLineList.append(promptSelected)
                                
                                self.totalTimeLine = totalTimeLine + selectionTime
                                self.promptSelected = ""
                                self.prompt1 = false
                                self.prompt2 = false
                                self.prompt3 = false
                                self.textDisplay = ""
                                self.selection = "15"
                                
                            }
                            
                            
                            
                            
                        }, label: {
                            Text("Add")
                                .foregroundColor(promptSelected == "" ? .black : .white)
                                .fontWeight(.light)
                                .frame(width: UIScreen.main.bounds.width - 100, height: 30)
                            
                        })
                            .background(promptSelected == "" ?  Color.gray.opacity(0.8) : Color("PaikaPrimaryColor"))
                            .cornerRadius(2)
                            .padding()
                    }
                    VStack{
                        Rectangle()
                            .fill(.gray.opacity(0.4))
                            .frame( height: 2)
                            .padding()
                    }
                    Text("Timeline")
                        .font(Font.system(size: 20, weight: .regular))
                        .foregroundColor(Color.black)
                    VStack{
                        ZStack{
                            Rectangle()
                                .fill(self.totalTimeLine < 60 ? .gray.opacity(0.4) : .white)
                                .frame( height: 55)
                            VStack(alignment:.leading){
                                HStack{
                                    ForEach(timeLineList, id: \.self) {
                                            //Text("\($0)")
                                        
                                        switch $0{
                                        case "Chat Votes":
                                            timelineItem(image: "Builder_chat_", nombre: "Chat Votes")
                                        case "Text Only":
                                            timelineItem(image: "Builder_Text_", nombre: "Text Only")
                                        case "Multiple Options":
                                            timelineItem(image:"Builder_Multiple_", nombre: "Multiple Options")
                                        default:
                                            Text("null")
                                        }
                                    }
                                    self.totalTimeLine < 60 ? Spacer() : nil
                                }
                            }
                        }
                        Text(totalTimeLine < 60 ? "Total: \(self.totalTimeLine) seconds" : "Total: \(self.totalTimeLine / 60) minute")
                            .font(.system(size: 13))
                    }
                    .padding()
                    
                    Text(timeLineList.count <= 0 ? "Timeline is empy add some prompts" : "")
                        .font(.system(size: 13))
                        .padding()
                    
                    HStack{
                        Button(action: {
                           
                            
                            
                            
                            
                            
                            
                        }, label: {
                            Text("Save")
                                .foregroundColor(.white)
                                .fontWeight(.bold)
                                .frame(width: UIScreen.main.bounds.width * 0.4, height: 30)
                        })
                            .background(Color("PaikaPrimaryColor"))
                            .cornerRadius(2)
                            .padding(.horizontal)
                        
                        
                        Button(action: {
                            self.loading = true
                            DispatchQueue.main.asyncAfter(deadline: .now()) {
                            Task{
                                do {
                                    appState.idInteraction = await appState.postInteraction(url_img: "test", hashtag: hashtag, players_number: playerNumber, random: self.randomPlayers ? 1 : 0, host_user: appState.userName, date: "pending", total_prompts: Int(timeLineList.count), player1_points: 0, player2_points: 0, player3_points: 0, player4_points: 0)
                                 
                                    
                                } catch {
                                    print(error)
                                }
                            }
                            
                                DispatchQueue.main.asyncAfter(deadline: .now() + 4.8){
                                    
                                    Task{
                                        do {
                                                for var promptItemFor in textOnlyArray {
                                                    promptItemFor.idInteraction = appState.idInteraction
                                                    
                                                    try await appState.postTextOnly(textOnlyModel: promptItemFor)
                                                }
                                                
                                                for var promptItemFor in votesArray {
                                                    promptItemFor.idInteraction = appState.idInteraction
                                                    try await appState.postVotes(votesModel: promptItemFor)
                                                }
                                                
                                                for var promptItemFor in MultipleOptionsArray{
                                                    promptItemFor.idInteraction = appState.idInteraction
                                                    try await appState.postMultipleOptions(multipleOptionsModel: promptItemFor)
                                                }
                                            appState.switchScene = .room
                                            self.loading = false
                                            
                                        } catch {
                                            print(error)
                                        }
                                    }
                                }
                            }
                            
                            

                        }, label: {
                            
                                Text("Save & Play")
                                    .foregroundColor(.white)
                                    .fontWeight(.bold)
                                    .frame(width: UIScreen.main.bounds.width * 0.4, height: 30)
                        })
                            .background(Color("PaikaPrimaryColor"))
                            .cornerRadius(2)
                            .padding(.horizontal)
                       
                    }
                    VStack{
                        Rectangle()
                            .fill(.white)
                            .frame( height: 65)
                    }
                }
            }
            .navigationBarTitle("Create a Interaction" )
            .toolbar {
                                ToolbarItemGroup(placement: .navigationBarTrailing) {
                                    Spacer()
                                    HStack {
                                        Button {
                                            print("Edit button was tapped")
                                        } label: {
                                            Image("SaveIcon")
                                                .resizable()
                                                .frame(width: 25, height: 25)
                                        }
                                        Button {
                                            print("Edit button was tapped")
                                        } label: {
                                            Image("BookMark")
                                                .resizable()
                                                .frame(width: 25, height: 25)
                                        }
                                    }
                                }

            }
            //.navigationBarTitle("Create a Interaction", displayMode: .inline )
        }
    }
}
