
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
    
    @State var hashtags : [[HashtagData]] = []
    
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
            ScrollView(.vertical, showsIndicators: true){
                VStack{
                    HStack{
                        Image("BuildImg_PH")
                            .resizable()
                            .frame(width: 100, height: 100)
                            .padding(.leading, -5)
                        VStack(alignment: .leading){
                            Text("Name")
                                .font(.system(size: 13))
                            TextField("", text: $name).background(RoundedRectangle(cornerRadius: 2).stroke(Color("PaikaBlack"),lineWidth: 1.5))
                                .frame(height: 15)
                            Text("Description")
                                .font(.system(size: 13))
                            TextField("", text: $description)
                                .background(RoundedRectangle(cornerRadius: 2).stroke(Color("PaikaBlack"),lineWidth: 1.5))
                                .frame(height: 15)
                        }.padding(.leading, 5)
                    }
                    Text("Hashtags")
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .font(.system(size: 13))
                    VStack(spacing: 10){
                        VStack(spacing:10){
                            ForEach(hashtags.indices, id: \.self){index in
                                HStack{
                                    ForEach(hashtags[index].indices, id: \.self){hashtagIndex in
                                        Text(hashtags[index][hashtagIndex].hashtagText)
                                            .foregroundColor(Color.white)
                                            .font(.system(size: 13))
                                            .fontWeight(.light)
                                            .padding(.vertical,10)
                                            .padding(.horizontal)
                                            .background(Capsule().fill(Color("PaikaSeccondColor")).frame(height: 20))
                                            .lineLimit(1)
                                            .overlay(
                                                GeometryReader{reader -> Color in
                                                    let maxX = reader.frame(in: .global).maxX
                                                    if maxX > UIScreen.main.bounds.width - 70 && !hashtags [index][hashtagIndex].isExceeded {
                                                        DispatchQueue.main.async {
                                                            
                                                            hashtags[index][hashtagIndex].isExceeded = true
                                                            
                                                            let lastItem = hashtags [index][hashtagIndex]
                                                            hashtags.append([lastItem])
                                                            hashtags[index].remove(at: hashtagIndex)
                                                        }
                                                    }
                                                    return Color.clear
                                                },
                                                alignment: .trailing
                                            )
                                            .clipShape(Capsule())
                                            
                                            
                                    }
                                }
                            }
                        }
                        HStack{
                            TextEditor(text: $hashtag)
                                .font(.system(size: 13))
                                .background(
                                    RoundedRectangle(cornerRadius: 2)
                                        .stroke(Color.white,lineWidth: 0))
                                .frame(height: 25)
                                .padding(3)
                            Button(action:{
                                if hashtags.isEmpty {
                                    hashtags.append([])
                                }
                                withAnimation(.default){
                                    hashtags[hashtags.count - 1].append(HashtagData(hashtagText: hashtag))
                                    self.hashtag = ""
                                }
                            }, label:{
                                Text("Add")
                                    .font(.system(size: 15))
                                    .foregroundColor(self.hashtag != "" ? Color("PaikaPrimaryColor") : Color.gray)
                                
                            }).disabled(hashtag == "")
                                .padding(.trailing, 5)
                        }
                        
                    }
                    .frame(width: UIScreen.main.bounds.width - 30)
                    .background(RoundedRectangle(cornerRadius: 2).stroke(Color("PaikaBlack"),lineWidth: 1.5))
                        
                    Text("Settings")
                        .font(Font.system(size: 20, weight: .regular))
                        .foregroundColor(Color.black)
                    Text("Players (Max)")
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .font(.system(size: 13))
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
                    
                    Rectangle()
                        .fill(.gray.opacity(0.4))
                        .frame( height: 2)
                    Text("Add prompts")
                        .font(Font.system(size: 20, weight:.regular))
                        .foregroundColor(Color.black)
                    Text("Players (Max)")
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .font(.system(size: 13))
                    
                }
                .padding()
            }
        }.navigationBarTitle("Create a Interaction" )
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
    }
}

struct timelineItem: View {
    var image: String
    var nombre: String
    
    
    var body: some View{
        VStack{
            HStack{
                Image(image + "Off")
                    .resizable()
                    .frame(width: 20, height: 20)
            }
            
        }
        .padding()
        .background(Color("PaikaSeccondColor"))
    }
    
    
}

struct CustomToggleStyle: ToggleStyle {
    var color: Color
    func makeBody(configuration: Configuration) -> some View {
        HStack{
            configuration.label
            Spacer()
            Button{
                configuration.isOn.toggle()
                
                
                
            } label: {
                ToggleItem(isOn: configuration.isOn, color: color)
            }
        }
    }
    
    struct ToggleItem: View {
        var isOn: Bool
        var color: Color
        var body: some View {
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color.gray.opacity(0.6), lineWidth: 1)
                .background(
                    RoundedRectangle(cornerRadius: 30)
                        .fill(isOn ? Color("PaikaSeccondColor"):Color.gray.opacity(0.50))
                )
                .frame(width: 62, height: 22)
                .overlay(
                    RoundedRectangle(cornerRadius: 30)
                        .stroke(Color.gray, lineWidth: 1)
                        .background(
                            RoundedRectangle(cornerRadius: 30)
                                .fill(isOn ? Color("PaikaSeccondColor") : Color.white)
                        )
                    
                        .frame(width: 30, height: 30),
                    alignment: isOn ? .trailing : .leading
                )
                .padding(.vertical)
        }
    }
}

struct CustomPlayerToggle : ToggleStyle{
    var number: Int
    
    func makeBody(configuration: Configuration) -> some View {
        HStack{
            Button(action: {
                configuration.isOn.toggle()
                
                
            }) {
                PlayerItem(isOn: configuration.isOn, number: number)
            }
        }
    }
    
    
    struct PlayerItem: View {
        var isOn: Bool
        var number: Int
        var body: some View {
            isOn ? Image("BuildPlayer\(number)_Selected")
                .resizable()
                .frame(width: 45, height: 45) :
            Image("BuildPlayer\(number)_Blank")
                .resizable()
                .frame(width: 45, height: 45)
        }
    }
}

struct CustomCheckToggle : ToggleStyle{
    func makeBody(configuration: Configuration) -> some View {
        HStack{
            Button(action: {
                configuration.isOn.toggle()
                
                
            }) {
                CheckItem(isOn: configuration.isOn)
            }
        }
    }
}

struct CheckItem: View {
    var isOn: Bool
    var body: some View {
        Image(systemName: isOn ? "checkmark.square.fill" : "square")
            .foregroundColor(isOn ? Color("PaikaSeccondColor") : .gray.opacity(0.4))
    }
}



struct CustomPromptToggle : ToggleStyle{
    var text: String
    var image: String
    func makeBody(configuration: Configuration) -> some View {
        HStack{
            Button(action: {
                configuration.isOn.toggle()
                
                
            }) {
                PromptItem(isOn: configuration.isOn, image: image, text: text)
            }
        }
    }
    
    
    struct PromptItem: View {
        var isOn: Bool
        var image: String
        var text: String
        var body: some View {
            VStack{
                isOn ? Image(image + "On")
                    .resizable()
                    .frame(width: 35, height: 35)
                
                :
                Image(image + "Off")
                    .resizable()
                    .frame(width: 35, height: 35)
                
                Text(text)
                    .foregroundColor(isOn ? Color("PaikaPrimaryColor"): Color.gray.opacity(0.65)  )
                    .font(.system(size: 13))
            }
        }
    }
}







struct BuilderView_Previews: PreviewProvider {
    static var previews: some View {
        BuilderView()
    }
}
