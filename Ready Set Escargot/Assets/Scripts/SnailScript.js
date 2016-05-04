﻿#pragma strict

var leftButton = KeyCode.LeftArrow;
var rightButton = KeyCode.RightArrow;
var downButton = KeyCode.DownArrow;
var upButton = KeyCode.UpArrow;
var toggleButton = KeyCode.Period;
var fireButton = KeyCode.Q;
var forceVector : Vector2 = Vector2(0,0);
var poweredUp : boolean = false;
var powerCounter : int = 0;
var slimy : boolean = false;
var slimyPatch : GameObject;
var powerUp : GameObject;
var shell : GameObject;
var player : String;
var finishCounter : int;
var onFinishLine : boolean = false;
var numLaps : int = 3;
var powerUpTime : float;
var absoluteControl : boolean = true;
var defaultMaxSpeed : float = 3.0;
var defaultAcceleration : int = 5;
var defaultHandling : int = 5;
var defaultMass : float = 1;
var maxSpeed : float;
var acceleration : int;
var handling : int;
var mass : float;
var heldPowerUp : int = 0;
var source: AudioSource;
var scream1 : AudioClip;
var scream2 : AudioClip;
var scream3 : AudioClip;
var scream4 : AudioClip;
var scream5: AudioClip;
var click: AudioClip;
var collision: AudioClip;
var slip: AudioClip;
var screams = [scream1,scream2,scream3,scream4,scream5];

function Start () {
	//acceleration = 5;
    //maxSpeed = 3.0;


    player = GetComponent.<UI.Text>().text;

    print(screams[1]);
}




function Update () {
    GetComponent.<Rigidbody2D>().mass = mass;
    var horizAxis : float = Input.GetAxis("Horizontal_"+player);
    var vertAxis : float = Input.GetAxis("Vertical_"+player);
    var horizAxis2 : float = Input.GetAxis("HorizRight_"+player);
    forceVector = Vector2(0,0);
    if(absoluteControl){
        forceVector = Vector2(horizAxis*acceleration,vertAxis*acceleration);
        if (Input.GetKey(leftButton)) {
            //GetComponent.<Rigidbody2D>().velocity.x = -speed;
            //transform.Translate(Vector2(-1, 0) * Time.deltaTime*speed);
            forceVector += Vector2(-1,0);
        }
        if (Input.GetKey(rightButton)) {
            //GetComponent.<Rigidbody2D>().velocity.x = speed;
            //transform.Translate(Vector2(1, 0) * Time.deltaTime*speed);
            forceVector += Vector2(1,0);
        }
        if (Input.GetKey(downButton)) {
            //GetComponent.<Rigidbody2D>().velocity.y = -speed;
            //transform.Translate(Vector2(0, -1) * Time.deltaTime*speed);
            forceVector += Vector2(0,-1);
        }
        if (Input.GetKey(upButton)) {
            //GetComponent.<Rigidbody2D>().velocity.y = speed;
            //transform.Translate(Vector2(0, 1) * Time.deltaTime*speed);
            forceVector += Vector2(0,1);
        }
    }
    else{
        transform.eulerAngles.z -= horizAxis2*handling;
        forceVector = transform.eulerAngles.z * transform.up * vertAxis;
        if (Input.GetKey(leftButton)) {
            //GetComponent.<Rigidbody2D>().velocity.x = -speed;
            //transform.Translate(Vector2(-1, 0) * Time.deltaTime*speed);
            transform.eulerAngles.z += handling;
        }
        if (Input.GetKey(rightButton)) {
            //GetComponent.<Rigidbody2D>().velocity.x = speed;
            //transform.Translate(Vector2(1, 0) * Time.deltaTime*speed);
            transform.eulerAngles.z -= handling;
        }
        if (Input.GetKey(downButton)) {
            //GetComponent.<Rigidbody2D>().velocity.y = -speed;
            //transform.Translate(Vector2(0, -1) * Time.deltaTime*speed);
            forceVector = transform.eulerAngles.z * transform.up*-1;
        }
        if (Input.GetKey(upButton)) {
            //GetComponent.<Rigidbody2D>().velocity.y = speed;
            //transform.Translate(Vector2(0, 1) * Time.deltaTime*speed);
            forceVector = transform.eulerAngles.z * transform.up;

        }
        
    }
    if (Input.GetKeyDown(toggleButton) || Input.GetButtonDown("Back_"+player)){
        absoluteControl = !absoluteControl;
        print("Absolute Controls on player "+player+": " + absoluteControl);
    }
    if(Input.GetKeyDown(fireButton) || Input.GetButtonDown("Fire_"+player)){
        if(heldPowerUp != 0){
            if (heldPowerUp == 1) {
                print("Speed Boost!");
                poweredUp = true;
                maxSpeed *= 1.5;
                acceleration *= 2;
            }
            else if (heldPowerUp == 2) {
                var shellInstance1 : GameObject;
                shellInstance1 = Instantiate(shell, transform.position - GetComponent.<Rigidbody2D>().velocity.normalized, transform.rotation);
                shellInstance1.GetComponent.<Rigidbody2D>().velocity = - GetComponent.<Rigidbody2D>().velocity.normalized;
                shellInstance1.GetComponent.<Rigidbody2D>().velocity += new Vector3(Random.Range(1,4), Random.Range(1,4), 0).normalized*4;

                var shellInstance2 : GameObject;
                shellInstance2 = Instantiate(shell, transform.position - GetComponent.<Rigidbody2D>().velocity.normalized, transform.rotation);
                shellInstance2.GetComponent.<Rigidbody2D>().velocity = - GetComponent.<Rigidbody2D>().velocity.normalized;
                shellInstance2.GetComponent.<Rigidbody2D>().velocity = new Vector3(Random.Range(1,4), Random.Range(1,4), 0).normalized*4;

                var shellInstance3 : GameObject;
                shellInstance3 = Instantiate(shell, transform.position - GetComponent.<Rigidbody2D>().velocity.normalized, transform.rotation);
                shellInstance3.GetComponent.<Rigidbody2D>().velocity = - GetComponent.<Rigidbody2D>().velocity.normalized;
                shellInstance3.GetComponent.<Rigidbody2D>().velocity += new Vector3(Random.Range(1,4), Random.Range(1,4), 0).normalized*4;
                
                print("SHELL STORM!");
            }
            else if (heldPowerUp == 3) {
                print("Slime patch!");
                Instantiate(slimyPatch, transform.position - GetComponent.<Rigidbody2D>().velocity.normalized * 2,transform.rotation);
            }
            else if (heldPowerUp == 4) {
                print("Shell created!");
                var shellInstance : GameObject;
                shellInstance = Instantiate(shell, transform.position - GetComponent.<Rigidbody2D>().velocity.normalized, Quaternion.identity);
                shellInstance.GetComponent.<Rigidbody2D>().velocity = - GetComponent.<Rigidbody2D>().velocity.normalized*4;
                shellInstance.GetComponent.<Rigidbody2D>().velocity += new Vector3(Random.Range(1,3), Random.Range(1,3), 0);
            }
            print("Player "+player+" used powerup "+heldPowerUp);
        }
        heldPowerUp = 0;
    }
    
    
if(GetComponent.<Rigidbody2D>().velocity.magnitude >= maxSpeed){
//	print("Over max speed!");
    GetComponent.<Rigidbody2D>().velocity = GetComponent.<Rigidbody2D>().velocity.normalized * maxSpeed;
}
//print(GetComponent.<Rigidbody2D>().velocity.magnitude);

if(GetComponent.<Rigidbody2D>().velocity.magnitude > 0 && !slimy && absoluteControl){
    var rotateAngle : float = Vector2.Angle(Vector2.up,GetComponent.<Rigidbody2D>().velocity);
    if(GetComponent.<Rigidbody2D>().velocity.x > 0){
        rotateAngle = -rotateAngle;
    }
    transform.eulerAngles.z = rotateAngle;
}
forceVector = forceVector.normalized;
if(Vector2.Angle(GetComponent.<Rigidbody2D>().velocity,forceVector) > 90 && GetComponent.<Rigidbody2D>().velocity.magnitude > 0){
    forceVector = forceVector*handling;
}
GetComponent.<Rigidbody2D>().AddForce(forceVector*acceleration);
powerCounter += 1;
if (powerUpTime >= 2){
    powerUpTime = 0;
    poweredUp = false;
    print("Power End!");
}

if(!poweredUp){
    maxSpeed = defaultMaxSpeed;
    acceleration = defaultAcceleration;
    mass = defaultMass;
    handling = defaultHandling;
    powerCounter = 0;
    slimy = false;
    onFinishLine = false;
}
else{
    powerUpTime += Time.deltaTime;
}
}

function OnTriggerEnter2D(trig: Collider2D){
    var powerUpPosition : Vector3 = trig.transform.position;
    if(trig.tag == "powerup"){
    	source.clip = collision;
    	source.Play();
        powerUpTime = 0;
        if(heldPowerUp == 0){
            heldPowerUp = Random.value * 4 + 1;
            print("Player "+player+" holding powerup "+heldPowerUp);
        }
        
        
        //hitplayer = true;
        Destroy(trig.gameObject);
        print("Powerup Destroyed");
        yield WaitForSeconds(4);
        print("Powerup Respawn");
        Instantiate(powerUp, powerUpPosition, Quaternion.identity);


    }
    else if(trig.tag == "slime"){
    	source.clip = slip;
    	source.Play();
        print("SLIMY SLOWDOWN");
        slimy = true;
        poweredUp = true;
        acceleration *= .25;
        Destroy(trig.gameObject);
        transform.rotation.z = Random.value * 360;
    }
    else if (trig.tag == "shell") {
    	source.clip = scream1;
    	source.Play();
        print("A shell hit you!");
        poweredUp = true;
        maxSpeed *= .75;
        acceleration *= .75;
        Destroy(trig.gameObject);
    }
    else if (trig.tag == "Finish" && GetComponent.<Rigidbody2D>().velocity.x < 0) {
        
        if (!onFinishLine) {
            finishCounter++;
            onFinishLine = true;
            print(player + " crosses the finish line!");
        }
        if (finishCounter >= numLaps) {
            print("You win!");
            if (GameObject.FindGameObjectsWithTag("Player").Length == 1) {
                Application.LoadLevel("game_over");
            }
            else {
                Destroy(this.gameObject);
            }
        }
    }
    else if (trig.tag == "Player"){
    	source.clip = scream2;
    	source.Play();

    }
    else if(trig.tag=="wall"){
    	source.clip = collision;
    	source.Play();
    }
    else {
        //print("Problem still here :P");
    }
}